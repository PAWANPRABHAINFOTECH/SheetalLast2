import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImageLightboxProps {
  src: string | null;
  alt?: string | null | undefined;
  onClose: () => void;
}


export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  return (
    <Dialog open={!!src} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-3xl overflow-y-auto rounded-2xl border-none bg-background p-3 sm:w-full max-h-[92vh]">
        <DialogTitle className="sr-only">{alt || "Poster"}</DialogTitle>
        {src && (
          <img
            src={src}
            alt={alt || "Poster"}
            className="mx-auto h-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />
        )}
        {alt && (
          <p className="font-hindi px-1 pb-1 text-center text-sm font-semibold text-primary">{alt}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
