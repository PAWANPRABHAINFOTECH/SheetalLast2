import { useRef, useState, useEffect } from "react";
import { Loader2, Upload, Link as LinkIcon, AlertCircle, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia, getVideoDuration } from "@/lib/admin/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "video";
  folder?: string;
  maxDuration?: number;
  onYoutubeData?: (data: { id: string; thumbnail: string; title?: string }) => void;
}

export function MediaInput({ value, onChange, kind, folder, maxDuration, onYoutubeData }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if prop value changes externally
  useEffect(() => {
    if (value !== urlInput) {
      setUrlInput(value || "");
    }
  }, [value]);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2] && match[2].length === 11) ? match[2] : null;
  };

  const validateUrl = (url: string) => {
    if (!url) {
      setIsValidUrl(true);
      return true;
    }
    try {
      const parsed = new URL(url);
      const isHttp = parsed.protocol === "http:" || parsed.protocol === "https:";
      setIsValidUrl(isHttp);
      return isHttp;
    } catch {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    validateUrl(val);
    setPreviewError(false);
    onChange(val);

    // Auto-detect YouTube for Special Videos
    if (onYoutubeData) {
      const ytId = extractYoutubeId(val);
      if (ytId) {
        onYoutubeData({
          id: ytId,
          thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        });
      }
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      if (kind === "video" && maxDuration) {
        const duration = await getVideoDuration(file);
        if (duration > maxDuration + 1) {
          toast.error(`वीडियो ${maxDuration} सेकंड से अधिक नहीं होना चाहिए`);
          return;
        }
      }
      const url = await uploadMedia(file, folder ?? kind);
      setUrlInput(url);
      setIsValidUrl(true);
      setPreviewError(false);
      onChange(url);
      toast.success("फ़ाइल अपलोड हो गई");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "अपलोड विफल");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const ytId = extractYoutubeId(urlInput);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={kind === "image" ? "इमेज URL डालें (उदा: https://...)" : "वीडियो URL डालें"}
              className={`pl-9 ${!isValidUrl ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">या</span>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="gap-2"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              अपलोड
            </Button>
          </div>
        </div>
        
        {!isValidUrl && urlInput && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              कृपया एक वैध HTTP/HTTPS URL डालें
            </AlertDescription>
          </Alert>
        )}

        {isValidUrl && previewError && urlInput && kind === "image" && !ytId && (
          <Alert className="py-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-300">
              Preview उपलब्ध नहीं है, लेकिन लिंक सेव किया जा सकता है।
            </AlertDescription>
          </Alert>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={kind === "image" ? "image/*" : "video/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {urlInput && isValidUrl && (
        <div className="mt-2 overflow-hidden rounded-lg border bg-muted/30 p-1">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
            {ytId && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF0000] uppercase">
                <Youtube className="h-3 w-3" /> YouTube Detect
              </span>
            )}
          </div>
          {ytId ? (
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="absolute inset-0 h-full w-full rounded"
                allowFullScreen
              />
            </div>
          ) : kind === "image" ? (
            <img 
              src={urlInput} 
              alt="preview" 
              className={`max-h-48 w-full rounded object-contain bg-white ${previewError ? 'hidden' : 'block'}`}
              onError={() => setPreviewError(true)}
              onLoad={() => setPreviewError(false)}
            />
          ) : (
            <video src={urlInput} controls className="max-h-48 w-full rounded" />
          )}
          {previewError && kind === "image" && !ytId && (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground italic">
              Preview loading error
            </div>
          )}
        </div>
      )}
    </div>
  );
}
