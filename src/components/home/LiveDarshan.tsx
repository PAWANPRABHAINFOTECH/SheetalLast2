import { useLiveDarshan } from "@/lib/temple.hooks";
import { PlayCircle, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiveDarshan() {
  const { data: live, isLoading } = useLiveDarshan();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500 text-white font-hindi text-sm font-bold animate-pulse mb-4">
          <span className="h-2 w-2 rounded-full bg-white" />
          लाइव
        </div>
        <h2 className="font-hindi text-3xl md:text-5xl font-bold text-primary mb-4">
          प्रभु के लाइव दर्शन
        </h2>
        <p className="font-hindi text-lg text-foreground/70">
          घर बैठे भगवान शिव के दर्शन एवं आरती का लाभ उठाएं।
        </p>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-primary/10 bg-black group">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p className="font-hindi">लोड हो रहा है...</p>
          </div>
        ) : !live || !live.is_active ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white bg-neutral-900">
            <PlayCircle className="h-20 w-20 mb-6 text-white/20" />
            <h3 className="font-hindi text-2xl font-bold mb-2">लाइव दर्शन शीघ्र उपलब्ध होगा</h3>
            <p className="font-hindi text-white/60">वर्तमान में कोई लाइव स्ट्रीम सक्रिय नहीं है।</p>
          </div>
        ) : live.mode === 'youtube' && live.youtube_url ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYouTubeId(live.youtube_url) ?? ''}?autoplay=0`}
            title="Live Darshan"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : live.video_url ? (
          <video
            className="w-full h-full object-cover"
            controls
            src={live.video_url}
          ></video>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white bg-neutral-900">
            <PlayCircle className="h-20 w-20 mb-6 text-white/20" />
            <h3 className="font-hindi text-2xl font-bold mb-2">लाइव दर्शन शीघ्र उपलब्ध होगा</h3>
            <p className="font-hindi text-white/60">वर्तमान में कोई लाइव स्ट्रीम सक्रिय नहीं है।</p>
          </div>
        )}
      </div>
      
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button size="lg" className="bg-red-600 hover:bg-red-700 font-hindi rounded-full">
          <Youtube className="mr-2 h-5 w-5" />
          YouTube पर देखें
        </Button>
        <Button size="lg" variant="outline" className="border-primary text-primary font-hindi rounded-full">
          सभी आरती वीडियो
        </Button>
      </div>
    </div>
  );
}

function getYouTubeId(url: string | null | undefined) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
