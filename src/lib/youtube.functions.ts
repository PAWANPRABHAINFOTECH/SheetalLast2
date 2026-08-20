import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { XMLParser } from "fast-xml-parser";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function resolveChannelId(url: string): Promise<string> {
  // 1. Direct ID in URL
  const idMatch = url.match(/(?:channel\/|UC)([a-zA-Z0-9_-]{22})/);
  if (idMatch?.[1]) return idMatch[1];

  // 2. Fetch page and extract ID for handles/custom URLs
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    const html = await res.text();
    
    // Look for externalId or browseId in the ytInitialData or meta tags
    const metaMatch = html.match(/meta itemprop="identifier" content="(UC[a-zA-Z0-9_-]{22})"/);
    if (metaMatch?.[1]) return metaMatch[1];

    const browseIdMatch = html.match(/"browseId":"(UC[a-zA-Z0-9_-]{22})"/);
    if (browseIdMatch?.[1]) return browseIdMatch[1];

    const externalIdMatch = html.match(/"externalId":"(UC[a-zA-Z0-9_-]{22})"/);
    if (externalIdMatch?.[1]) return externalIdMatch[1];

    // Try to extract from canonical link
    const canonicalMatch = html.match(/link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})"/);
    if (canonicalMatch?.[1]) return canonicalMatch[1];

    // Generic channel ID match in the body
    const genericMatch = html.match(/(UC[a-zA-Z0-9_-]{22})/);
    if (genericMatch?.[1]) return genericMatch[1];

  } catch (error) {
    console.error("Error resolving channel ID:", error);
  }

  throw new Error("चैनल ID प्राप्त नहीं हो सकी। कृपया सही YouTube Channel URL डालें।");
}

export const syncYoutubeVideos = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ channelUrl: z.string() }).parse(data))
  .handler(async ({ data: { channelUrl }, context }) => {
    const { supabase } = context;
    const channelId = await resolveChannelId(channelUrl);
    
    // Fetch RSS Feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error("RSS fetch failed:", res.status, res.statusText);
      throw new Error("YouTube से डेटा प्राप्त नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें।");
    }
    
    const xmlData = await res.text();
    if (!xmlData || xmlData.length < 100) {
       console.error("RSS data too short:", xmlData);
       throw new Error("YouTube से डेटा प्राप्त नहीं हो सका।");
    }
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const jsonObj = parser.parse(xmlData);

    const feed = jsonObj.feed;
    if (!feed) {
      throw new Error("RSS feed parse error: No feed found.");
    }

    const channelName = feed.title || "";
    
    let entries = feed.entry || [];
    if (!Array.isArray(entries)) entries = [entries];

    let newCount = 0;
    
    for (const entry of entries) {
      const videoId = entry["yt:videoId"] || (typeof entry.id === 'string' ? entry.id.split(":").pop() : entry.id?.toString().split(":").pop());
      if (!videoId) continue;

      const title = typeof entry.title === 'object' ? (entry.title['#text'] || entry.title.toString()) : (entry.title || "");
      const published = entry.published || entry.updated;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      
      const mediaGroup = entry["media:group"];
      let thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      
      if (mediaGroup?.["media:thumbnail"]) {
        const thumb = mediaGroup["media:thumbnail"];
        thumbnail = Array.isArray(thumb) ? thumb[0]["@_url"] : thumb["@_url"];
      }

      const description = mediaGroup?.["media:description"] || "";

      // We use a manual check before upsert to correctly count new videos
      const { data: existing } = await supabase
        .from("youtube_videos")
        .select("id, is_active")
        .eq("youtube_id", videoId)
        .eq("source_type", "synced")
        .maybeSingle();

      const { error: upsertError } = await supabase
        .from("youtube_videos")
        .upsert({
          youtube_id: videoId,
          title: title,
          thumbnail: thumbnail,
          published_at: published,
          url: url,
          description: description,
          channel_name: channelName,
          source_type: "synced",
          is_active: true
        }, { onConflict: "youtube_id,source_type" });
      
      if (upsertError) {
        console.error("Error upserting video:", upsertError);
      } else if (!existing) {
        newCount++;
      }
    }

    // Update Site Settings
    const { data: settings, error: settingsFetchError } = await supabase.from("site_settings").select("id").single();
    if (!settingsFetchError && settings) {
      const { error: settingsUpdateError } = await supabase.from("site_settings").update({
        youtube_channel_url: channelUrl,
        youtube_channel_name: channelName,
        youtube_last_sync_at: new Date().toISOString(),
        youtube_video_count: entries.length,
        devotee_count: settings.devotee_count // Preserve existing fields if any
      }).eq("id", settings.id);
      
      if (settingsUpdateError) {
        console.error("Error updating site settings:", settingsUpdateError);
      }
    }

    return { 
      success: true, 
      channelName, 
      videoCount: entries.length,
      newCount
    };
  });