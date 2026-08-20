import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const getSiteSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    
    if (error) throw error;
    return data;
  });

export const getHeroSlides = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const getActiveNotices = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const getTempleInfo = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("temple_info")
      .select("*");
    
    if (error) throw error;
    return data;
  });

export const getTempleTimings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("temple_timings")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const getMembers = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const getNews = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_active", true)
      .order("publish_date", { ascending: false });
    
    if (error) throw error;
    return data;
  });

export const getGallery = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  });

export const getLiveDarshan = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("live_darshan")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  });

export const getChairmanMessage = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("chairman_messages")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  });

export const getAdvertisements = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return data;
  });

export const getYoutubeVideos = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ 
    source_type: z.enum(["synced", "special"]).optional() 
  }).optional().parse(data))
  .handler(async ({ data }) => {
    let query = supabase
      .from("youtube_videos")
      .select("*")
      .eq("is_active", true);
    
    if (data?.source_type) {
      query = query.eq("source_type", data.source_type);
    }
    
    const { data: videos, error } = await query.order(
      data?.source_type === "special" ? "display_order" : "published_at", 
      { ascending: data?.source_type === "special" ? true : false }
    );
    
    if (error) throw error;
    return videos;
  });
