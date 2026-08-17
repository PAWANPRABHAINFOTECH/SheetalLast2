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
          {notices.map((notice, idx) => {
            const isInternal = notice.link_url?.startsWith('/');
            const content = (
              <div className="inline-flex items-center mx-8">
                {notice.link_url ? (
                  <div className="font-hindi text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                    {notice.content}
                    {notice.link_text && (
                      <span className="text-primary underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </div>
                ) : (
                  <span className="font-hindi text-sm text-foreground">{notice.content}</span>
                )}
              </div>
            );

            if (notice.link_url) {
              if (isInternal) {
                return <Link key={notice.id} to={notice.link_url as any}>{content}</Link>;
              }
              return <a key={notice.id} href={notice.link_url} target="_blank" rel="noopener noreferrer">{content}</a>;
            }
            return <div key={notice.id}>{content}</div>;
          })}
          {/* Duplicate for seamless scrolling */}
          {notices.map((notice, idx) => {
            const isInternal = notice.link_url?.startsWith('/');
            const content = (
              <div className="inline-flex items-center mx-8">
                {notice.link_url ? (
                  <div className="font-hindi text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                    {notice.content}
                    {notice.link_text && (
                      <span className="text-primary underline decoration-dotted">{notice.link_text}</span>
                    )}
                  </div>
                ) : (
                  <span className="font-hindi text-sm text-foreground">{notice.content}</span>
                )}
              </div>
            );

            if (notice.link_url) {
              if (isInternal) {
                return <Link key={`${notice.id}-dup`} to={notice.link_url as any}>{content}</Link>;
              }
              return <a key={`${notice.id}-dup`} href={notice.link_url} target="_blank" rel="noopener noreferrer">{content}</a>;
            }
            return <div key={`${notice.id}-dup`}>{content}</div>;
          })}
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
