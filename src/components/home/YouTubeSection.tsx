import { useYoutubeVideos, useSiteSettings } from "@/lib/temple.hooks";
import { Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function YouTubeSection() {
  const { data: videos, isLoading } = useYoutubeVideos();
  const { data: settings } = useSiteSettings();
  const { t } = useI18n();
  const [displayCount, setDisplayCount] = useState(4);

  if (isLoading || !videos || videos.length === 0) return null;

  const visibleVideos = videos.slice(0, displayCount);
  const hasMore = videos.length > displayCount;

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 pb-6">
        <div className="space-y-2">
          <h2 className="flex items-center gap-3 font-hindi text-3xl md:text-4xl font-bold text-primary">
            <Youtube className="h-8 w-8 text-[#FF0000]" /> {t("यूट्यूब चैनल", "YouTube Channel")}
          </h2>
          <p className="font-hindi text-lg text-foreground/70 italic">
            {settings?.youtube_channel_name || "शीतल शिवालय समिति"} - नवीनतम वीडियो
          </p>
        </div>
        {settings?.youtube_channel_url && (
          <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5" asChild>
            <a href={settings.youtube_channel_url} target="_blank" rel="noopener noreferrer">
              चैनल देखें <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleVideos.map((video) => (
          <a
            key={video.id}
            href={video.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnail || ""}
                alt={video.title || ""}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg">
                  <Youtube className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="line-clamp-2 font-hindi text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              {video.published_at && (
                <p className="mt-auto pt-3 text-xs text-muted-foreground uppercase tracking-wider">
                  {new Date(video.published_at).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="min-w-[200px] rounded-full border-primary font-hindi text-primary hover:bg-primary hover:text-white"
            onClick={() => setDisplayCount((prev) => prev + 4)}
          >
            {t("और वीडियो देखें", "More Videos")}
          </Button>
        </div>
      )}
    </section>
  );
}