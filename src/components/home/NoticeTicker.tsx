import { useNotices } from "@/lib/temple.hooks";
import { Megaphone } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NoticeTicker() {
  const { data: notices, isLoading } = useNotices();

  // Filter only current notices based on date if present
  const activeNotices = notices?.filter(notice => {
    if (!notice.is_active) return false;
    const now = new Date();
    if (notice.start_date && new Date(notice.start_date) > now) return false;
    if (notice.end_date && new Date(notice.end_date) < now) return false;
    return true;
  }) || [];

  if (isLoading || activeNotices.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground h-[36px] md:h-[42px] overflow-hidden flex items-center relative z-[60]">
      <div className="flex items-center h-full px-4 bg-primary z-10 shadow-[4px_0_8px_rgba(0,0,0,0.2)]">
        <Megaphone className="h-4 w-4 mr-2 animate-bounce" />
        <span className="font-hindi text-sm font-bold whitespace-nowrap">महत्वपूर्ण सूचना</span>
        <span className="mx-2 opacity-50">|</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap">
          {activeNotices.map((notice, idx) => (
            <div key={notice.id} className="inline-flex items-center px-4">
              {notice.link_url ? (
                <Link 
                  to={notice.link_url.startsWith('/') ? (notice.link_url as any) : undefined}
                  className="font-hindi text-sm hover:text-secondary transition-colors"
                  {...(notice.link_url.startsWith('/') ? {} : { 
                    tagName: 'a',
                    href: notice.link_url,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  } as any)}
                >
                  {notice.content}
                  {notice.link_text && (
                    <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                  )}
                </Link>
              ) : (
                <span className="font-hindi text-sm">{notice.content}</span>
              )}
              {idx < activeNotices.length - 1 && <span className="mx-6 text-secondary/50">•</span>}
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          <span className="mx-6 text-secondary/50">•</span>
          {activeNotices.map((notice, idx) => (
            <div key={`${notice.id}-dup`} className="inline-flex items-center px-4">
              {notice.link_url ? (
                <Link 
                  to={notice.link_url.startsWith('/') ? (notice.link_url as any) : undefined}
                  className="font-hindi text-sm hover:text-secondary transition-colors"
                  {...(notice.link_url.startsWith('/') ? {} : { 
                    tagName: 'a',
                    href: notice.link_url,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  } as any)}
                >
                  {notice.content}
                  {notice.link_text && (
                    <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                  )}
                </Link>
              ) : (
                <span className="font-hindi text-sm">{notice.content}</span>
              )}
              {idx < activeNotices.length - 1 && <span className="mx-6 text-secondary/50">•</span>}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
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
