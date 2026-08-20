import { useYoutubeVideos, useSiteSettings } from "@/lib/temple.hooks";
import { Youtube, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function YouTubeSection() {
  const { data: syncedVideos, isLoading: loadingSynced } = useYoutubeVideos("synced");
  const { data: specialVideos, isLoading: loadingSpecial } = useYoutubeVideos("special");
  const { data: settings } = useSiteSettings();
  const { t } = useI18n();
  const [displayCountSynced, setDisplayCountSynced] = useState(8);
  const [displayCountSpecial, setDisplayCountSpecial] = useState(8);

  const renderVideoGrid = (videos: any[], count: number, setCount: React.Dispatch<React.SetStateAction<number>>) => {
    const visibleVideos = videos.filter(v => v.is_active !== false && v.youtube_id && v.source_type === (videos === syncedVideos ? 'synced' : 'special')).slice(0, count);
    const hasMore = videos.filter(v => v.is_active !== false && v.youtube_id && v.source_type === (videos === syncedVideos ? 'synced' : 'special')).length > count;

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleVideos.map((video) => (
            <a
              key={video.id}
              href={video.url || `https://www.youtube.com/watch?v=${video.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {video.youtube_id ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                    alt={video.title || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg';
                    }}
                  />
                ) : (
                  <img
                    src={video.thumbnail || ""}
                    alt={video.title || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg">
                    <Youtube className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 font-hindi text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                  {video.title || (video.source_type === 'special' ? 'विशेष वीडियो' : 'यूट्यूब वीडियो')}
                </h3>
                {(video.published_at || video.description) && (
                  <div className="mt-auto pt-3 flex flex-col gap-1">
                    {video.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground italic">
                        {video.description}
                      </p>
                    )}
                    {video.published_at && (
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {new Date(video.published_at).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => setCount((prev) => prev + 8)}
            >
              {t("और वीडियो देखें")}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-16">
      {/* Synced Videos Section */}
      {syncedVideos && syncedVideos.length > 0 && (
        <section className="py-16 container mx-auto px-4 border-b border-primary/5">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 pb-6">
            <div className="space-y-2">
              <h2 className="flex items-center gap-3 font-hindi text-3xl md:text-4xl font-bold text-primary">
                {t("यूट्यूब चैनल")}
              </h2>
              <div className="h-0.5 bg-black w-full" />
              <p className="font-hindi text-lg text-foreground/70 italic">
                {settings?.youtube_channel_name || "शीतल शिवालय समिति"} - नवीनतम वीडियो
              </p>
            </div>
            {settings?.youtube_channel_url && (
              <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5" asChild>
                <a href="https://www.youtube.com/@SheetalShivalayaSamiti" target="_blank" rel="noopener noreferrer">
                  {t("चैनल देखें")} <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          {renderVideoGrid(syncedVideos, displayCountSynced, setDisplayCountSynced)}
        </section>
      )}

      {/* Special Videos Section */}
      {specialVideos && specialVideos.length > 0 && (
        <section className="py-16 container mx-auto px-4 bg-primary/5 rounded-3xl mb-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 pb-6">
            <div className="space-y-2">
              <h2 className="flex items-center gap-3 font-hindi text-3xl md:text-4xl font-bold text-primary">
                {t("विशेष झलकियां")}
              </h2>
            </div>
          </div>
          {renderVideoGrid(specialVideos, displayCountSpecial, setDisplayCountSpecial)}
        </section>
      )}
    </div>
  );
}
