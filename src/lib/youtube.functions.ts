import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const syncYoutubeVideos = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ channelUrl: z.string() }).parse(data))
  .handler(async ({ data: { channelUrl } }) => {
    const API_KEY = process.env['YOUTUBE_API_KEY'];
    if (!API_KEY) {
      throw new Error("YOUTUBE_API_KEY is not configured in environment variables.");
    }

    // Extract Channel ID or Username
    let channelId = "";
    if (channelUrl.includes("/channel/")) {
      const parts = channelUrl.split("/channel/");
      const suffix = parts[1];
      channelId = suffix ? (suffix.split("/")[0] || "") : "";
    } else if (channelUrl.includes("/@")) {
      const parts = channelUrl.split("/@");
      const handlePart = parts[1];
      const handle = handlePart ? (handlePart.split("/")[0] || "") : "";
      // Need to resolve handle to channel ID
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics&forHandle=@${handle}&key=${API_KEY}`);
      const json = await res.json();
      if (json.items && json.items.length > 0) {
        channelId = json.items[0].id;
      }
    } else if (channelUrl.includes("/c/") || channelUrl.includes("/user/")) {
      // Simplification: try searching for channel if it's a custom URL
      const parts = channelUrl.split("/");
      const name = parts[parts.length - 1];
      const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics&forUsername=${name}&key=${API_KEY}`);
      const json = await res.json();
      if (json.items && json.items.length > 0) {
        channelId = json.items[0].id;
      }
    }

    if (!channelId) {
      throw new Error("Could not resolve YouTube Channel ID from URL.");
    }

    // Fetch Channel Details
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
    const channelJson = await channelRes.json();
    if (!channelJson.items || channelJson.items.length === 0) {
      throw new Error("YouTube Channel not found.");
    }

    const channelData = channelJson.items[0];
    const channelName = channelData.snippet.title;
    const channelLogo = channelData.snippet.thumbnails.default.url;
    const subscriberCount = channelData.statistics.subscriberCount;

    // Fetch Videos
    const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${API_KEY}`);
    const videosJson = await videosRes.json();
    
    if (videosJson.error) {
      throw new Error(videosJson.error.message);
    }

    const videos = videosJson.items || [];
    
    // Upsert Videos
    for (const v of videos) {
      const videoId = v.id.videoId;
      const { error: upsertError } = await supabase
        .from("youtube_videos")
        .upsert({
          youtube_id: videoId,
          title: v.snippet.title,
          thumbnail: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.default?.url,
          published_at: v.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          description: v.snippet.description,
          channel_name: channelName,
        }, { onConflict: "youtube_id" });
      
      if (upsertError) console.error("Error upserting video:", upsertError);
    }

    // Update Site Settings
    const { data: settings } = await supabase.from("site_settings").select("id").single();
    if (settings) {
      await supabase.from("site_settings").update({
        youtube_channel_url: channelUrl,
        youtube_channel_name: channelName,
        youtube_channel_logo: channelLogo,
        youtube_subscriber_count: subscriberCount,
        youtube_last_sync_at: new Date().toISOString(),
        youtube_video_count: videos.length
      }).eq("id", settings.id);
    }

    return { 
      success: true, 
      channelName, 
      videoCount: videos.length 
    };
  });
