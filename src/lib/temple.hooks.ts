import { useQuery } from "@tanstack/react-query";
import { 
  getSiteSettings, 
  getHeroSlides, 
  getActiveNotices, 
  getTempleInfo,
  getTempleTimings,
  getMembers,
  getNews,
  getGallery,
  getLiveDarshan,
  getChairmanMessage,
  getAdvertisements,
  getYoutubeVideos
} from "@/lib/temple.functions";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
  });
}

export function useHeroSlides() {
  return useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => getHeroSlides(),
  });
}

export function useNotices() {
  return useQuery({
    queryKey: ["notices"],
    queryFn: () => getActiveNotices(),
  });
}

export function useTempleInfo() {
  return useQuery({
    queryKey: ["temple-info"],
    queryFn: () => getTempleInfo(),
  });
}

export function useTempleTimings() {
  return useQuery({
    queryKey: ["temple-timings"],
    queryFn: () => getTempleTimings(),
  });
}

export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(),
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => getNews(),
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => getGallery(),
  });
}

export function useLiveDarshan() {
  return useQuery({
    queryKey: ["live-darshan"],
    queryFn: () => getLiveDarshan(),
  });
}

export function useChairmanMessage() {
  return useQuery({
    queryKey: ["chairman-message"],
    queryFn: () => getChairmanMessage(),
  });
}

export function useAdvertisements() {
  return useQuery({
    queryKey: ["advertisements"],
    queryFn: () => getAdvertisements(),
  });
}

export function useYoutubeVideos(source_type?: "synced" | "special") {
  return useQuery({
    queryKey: ["youtube-videos", source_type],
    queryFn: () => getYoutubeVideos({ data: { source_type } }),
  });
}
