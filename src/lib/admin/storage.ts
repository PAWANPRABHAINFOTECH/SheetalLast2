import { supabase } from "@/integrations/supabase/client";

const BUCKET = "temple-media";
// Long-lived signed URL (~10 years) since the media bucket is private.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadMedia(file: File, folder = "general"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !data) throw signError ?? new Error("URL बनाने में त्रुटि");

  return data.signedUrl;
}

export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("वीडियो पढ़ा नहीं जा सका"));
    video.src = URL.createObjectURL(file);
  });
}
