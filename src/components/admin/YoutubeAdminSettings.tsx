import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Youtube, RefreshCw, CheckCircle2, AlertCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSiteSettings } from "@/lib/temple.hooks";
import { syncYoutubeVideos } from "@/lib/youtube.functions";

export function YoutubeAdminSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const [url, setUrl] = useState(settings?.youtube_channel_url || "");
  const queryClient = useQueryClient();

  const sync = useMutation({
    mutationFn: (channelUrl: string) => syncYoutubeVideos({ data: { channelUrl } }),
    onSuccess: (data) => {
      toast.success(data.newCount > 0 ? `सिंक सफल — ${data.newCount} नए वीडियो मिले।` : "सिंक सफल — कोई नया वीडियो नहीं मिला।");
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "youtube_videos"] });
      void queryClient.invalidateQueries({ queryKey: ["youtube-videos"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return null;

  return (
    <Card className="border-primary/10 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-primary">
          <Youtube className="h-6 w-6 text-[#FF0000]" /> यूट्यूब चैनल सिंक
        </CardTitle>
        <CardDescription>
          अपने मंदिर के यूट्यूब चैनल से वीडियो सिंक करें।
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold">YouTube Channel Link</label>
            <Input
              placeholder="उदा: https://www.youtube.com/@channelname"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => sync.mutate(url)} 
            disabled={sync.isPending || !url}
            className="gap-2"
          >
            {sync.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            सिंक करें
          </Button>
        </div>

        {settings?.youtube_channel_name && (
          <div className="grid gap-4 rounded-xl border border-primary/5 bg-primary/5 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <Youtube className="h-5 w-5 text-[#FF0000]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">कनेक्टेड चैनल</p>
                <p className="truncate font-bold">{settings.youtube_channel_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">अंतिम सिंक</p>
                <p className="font-bold">
                  {settings.youtube_last_sync_at 
                    ? new Date(settings.youtube_last_sync_at).toLocaleString('hi-IN')
                    : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">वीडियो की संख्या</p>
                <p className="font-bold">{settings.youtube_video_count || 0}</p>
              </div>
            </div>
          </div>
        )}


        {!settings?.youtube_channel_name && !sync.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" /> अभी कोई चैनल कनेक्ट नहीं है।
          </div>
        )}
      </CardContent>
    </Card>
  );
}