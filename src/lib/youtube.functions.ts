import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { XMLParser } from "fast-xml-parser";

async function resolveChannelId(url: string): Promise<string> {
  // 1. Direct ID in URL
  const idMatch = url.match(/(?:channel\/|UC)([a-zA-Z0-9_-]{22})/);
  if (idMatch) return idMatch[1];

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
    if (metaMatch) return metaMatch[1];

    const browseIdMatch = html.match(/"browseId":"(UC[a-zA-Z0-9_-]{22})"/);
    if (browseIdMatch) return browseIdMatch[1];

    const externalIdMatch = html.match(/"externalId":"(UC[a-zA-Z0-9_-]{22})"/);
    if (externalIdMatch) return externalIdMatch[1];

    // Canonical link
    const canonicalMatch = html.match(/link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})"/);
    if (canonicalMatch) return canonicalMatch[1];

  } catch (error) {
    console.error("Error resolving channel ID:", error);
  }

  throw new Error("चैनल ID प्राप्त नहीं हो सकी। कृपया सही YouTube Channel URL डालें।");
}

export const syncYoutubeVideos = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ channelUrl: z.string() }).parse(data))
  .handler(async ({ data: { channelUrl } }) => {
    const channelId = await resolveChannelId(channelUrl);
    
    // Fetch RSS Feed
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl);
    if (!res.ok) {
      throw new Error("YouTube से डेटा प्राप्त नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें।");
    }
    
    const xmlData = await res.text();
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
    // RSS doesn't give subscriber count easily, but we can get channel logo from author or link
    const channelLogo = `https://www.youtube.com/s/desktop/82d00881/img/favicon_144x144.png`; // Fallback favicon
    
    let entries = feed.entry || [];
    if (!Array.isArray(entries)) entries = [entries];

    let newCount = 0;
    
    for (const entry of entries) {
      const videoId = entry["yt:videoId"] || entry.id?.split(":").pop();
      if (!videoId) continue;

      const title = entry.title || "";
      const published = entry.published || entry.updated;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const thumbnail = entry["media:group"]?.["media:thumbnail"]?.["@_url"] || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      const description = entry["media:group"]?.["media:description"] || "";

      const { data: existing } = await supabase
        .from("youtube_videos")
        .select("id")
        .eq("youtube_id", videoId)
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
        }, { onConflict: "youtube_id" });
      
      if (!upsertError && !existing) {
        newCount++;
      }
      if (upsertError) console.error("Error upserting video:", upsertError);
    }

    // Update Site Settings
    const { data: settings } = await supabase.from("site_settings").select("id").single();
    if (settings) {
      await supabase.from("site_settings").update({
        youtube_channel_url: channelUrl,
        youtube_channel_name: channelName,
        // Keep logo and subscriber count if they already exist, or use defaults
        youtube_last_sync_at: new Date().toISOString(),
        youtube_video_count: entries.length
      }).eq("id", settings.id);
    }

    return { 
      success: true, 
      channelName, 
      videoCount: entries.length,
      newCount
    };
  });
