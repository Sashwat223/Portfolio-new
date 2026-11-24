import React, { useEffect, useState } from 'react';
import { CHAPTERS } from '../data/portfolioData';

export const ChapterNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('introduction');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    CHAPTERS.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Minimal top-right floating index pill on mobile/tablet */}
      <nav
        aria-label="Portfolio chapters"
        className="fixed top-5 right-5 z-40 hidden xl:flex flex-col items-end gap-2.5 mix-blend-difference"
      >
        {CHAPTERS.map((ch) => {
          const isActive = activeId === ch.id;
          return (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className="group flex items-center gap-3 py-0.5 text-right transition-all"
            >
              <span
                className={`font-mono-tech text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 text-[#D4AF7A] translate-x-0'
                    : 'opacity-0 group-hover:opacity-80 text-[#F4F4F0] translate-x-2 group-hover:translate-x-0'
                }`}
              >
                {ch.label}
              </span>
              <span
                className={`h-[1px] transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-[#D4AF7A]'
                    : 'w-3 bg-white/30 group-hover:w-5 group-hover:bg-white/70'
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
};
