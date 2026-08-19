import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMedia, getVideoDuration } from "@/lib/admin/storage";

interface Props {
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "video";
  folder?: string;
  maxDuration?: number;
}

export function MediaInput({ value, onChange, kind, folder, maxDuration }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="flex gap-2">
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL या फ़ाइल अपलोड करें"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
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
      {value && kind === "image" && (
        <img src={value} alt="preview" className="h-24 w-auto rounded-lg border object-cover" />
      )}
      {value && kind === "video" && (
        <video src={value} controls className="h-32 w-auto rounded-lg border" />
      )}
    </div>
  );
}
