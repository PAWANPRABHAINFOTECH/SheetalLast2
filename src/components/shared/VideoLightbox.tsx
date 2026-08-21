import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface VideoLightboxProps {
  youtubeId: string | null;
  title?: string | null;
  onClose: () => void;
}

export function VideoLightbox({ youtubeId, title, onClose }: VideoLightboxProps) {
  return (
    <Dialog open={!!youtubeId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-3xl overflow-hidden rounded-2xl border-none bg-black p-0 sm:w-full">
        <DialogTitle className="sr-only">{title || "Video"}</DialogTitle>
        {youtubeId && (
          <div className="aspect-video w-full">
            <iframe
              key={youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={title || "YouTube video player"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
        {title && (
          <p className="font-hindi px-4 pb-4 text-sm font-semibold text-white">{title}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
