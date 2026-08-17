import { useNotices } from "@/lib/temple.hooks";
import { Megaphone } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NoticeTicker() {
  const { data: notices, isLoading } = useNotices();

  if (isLoading || !notices || notices.length === 0) return null;

  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2 overflow-hidden whitespace-nowrap relative">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-hindi z-10 mr-4 shrink-0">
          <Megaphone className="h-4 w-4" />
          <span>सूचना:</span>
        </div>
        
        <div className="flex animate-marquee hover:pause-marquee">
          {notices.map((notice) => (
            <div key={notice.id} className="inline-flex items-center mx-8">
              {notice.link_url ? (
                <Link 
                  to={notice.link_url} 
                  className="font-hindi text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  {notice.content}
                  {notice.link_text && (
                    <span className="text-primary underline decoration-dotted">{notice.link_text}</span>
                  )}
                </Link>
              ) : (
                <span className="font-hindi text-sm text-foreground">{notice.content}</span>
              )}
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {notices.map((notice) => (
            <div key={`${notice.id}-dup`} className="inline-flex items-center mx-8">
              {notice.link_url ? (
                <Link 
                  to={notice.link_url} 
                  className="font-hindi text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  {notice.content}
                  {notice.link_text && (
                    <span className="text-primary underline decoration-dotted">{notice.link_text}</span>
                  )}
                </Link>
              ) : (
                <span className="font-hindi text-sm text-foreground">{notice.content}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .pause-marquee {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
