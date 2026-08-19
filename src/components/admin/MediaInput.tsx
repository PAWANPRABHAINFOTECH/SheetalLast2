import { useRef, useState, useEffect } from "react";
import { Loader2, Upload, Link as LinkIcon, AlertCircle } from "lucide-react";
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
}

export function MediaInput({ value, onChange, kind, folder, maxDuration }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if prop value changes externally
  useEffect(() => {
    if (value !== urlInput) {
      setUrlInput(value || "");
    }
  }, [value]);

  const validateUrl = (url: string) => {
    if (!url) {
      setIsValidUrl(true);
      return true;
    }
    try {
      new URL(url);
      setIsValidUrl(true);
      return true;
    } catch {
      setIsValidUrl(false);
      return false;
    }
  };

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    validateUrl(val);
    onChange(val);
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
      onChange(url);
      toast.success("फ़ाइल अपलोड हो गई");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "अपलोड विफल");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

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
              कृपया एक वैध URL डालें
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
          </div>
          {kind === "image" ? (
            <img 
              src={urlInput} 
              alt="preview" 
              className="max-h-48 w-full rounded object-contain bg-white"
              onError={() => setIsValidUrl(false)}
            />
          ) : (
            <video src={urlInput} controls className="max-h-48 w-full rounded" />
          )}
        </div>
      )}
    </div>
  );
}
