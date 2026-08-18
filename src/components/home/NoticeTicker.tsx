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
    <div className="bg-[#D98216] h-[40px] md:h-[48px] overflow-hidden flex items-center relative z-[60] border-y border-black/10">
      <div className="flex items-center h-full px-6 bg-[#D98216] z-10 shadow-[4px_0_8px_rgba(0,0,0,0.1)]">
        <Megaphone className="h-4 w-4 mr-2 text-black" />
        <span className="font-hindi text-base font-bold text-black whitespace-nowrap">महत्वपूर्ण सूचना</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center bg-[#F2F2F2]">
        <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap">
          {activeNotices.map((notice) => (
            <div key={notice.id} className="inline-flex items-center px-4">
              {notice.link_url ? (
                notice.link_url.startsWith('/') ? (
                  <Link 
                    to={notice.link_url as any}
                    className="font-hindi text-base font-bold text-black hover:text-[#D98216] transition-colors"
                  >
                    {notice.content}
                    {notice.link_text && (
                      <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </Link>
                ) : (
                  <a 
                    href={notice.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-hindi text-base font-bold text-black hover:text-[#D98216] transition-colors"
                  >
                    {notice.content}
                    {notice.link_text && (
                      <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </a>
                )
              ) : (
                <span className="font-hindi text-base font-bold text-black">{notice.content}</span>
              )}
              <span className="mx-8 text-black/30 font-bold">•</span>
            </div>
          ))}
          {/* Duplicate for seamless scrolling */}
          {activeNotices.map((notice) => (
            <div key={`${notice.id}-dup`} className="inline-flex items-center px-4">
              {notice.link_url ? (
                notice.link_url.startsWith('/') ? (
                  <Link 
                    to={notice.link_url as any}
                    className="font-hindi text-base font-bold text-black hover:text-[#D98216] transition-colors"
                  >
                    {notice.content}
                    {notice.link_text && (
                      <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </Link>
                ) : (
                  <a 
                    href={notice.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-hindi text-base font-bold text-black hover:text-[#D98216] transition-colors"
                  >
                    {notice.content}
                    {notice.link_text && (
                      <span className="ml-2 underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </a>
                )
              ) : (
                <span className="font-hindi text-base font-bold text-black">{notice.content}</span>
              )}
              <span className="mx-8 text-black/30 font-bold">•</span>
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
