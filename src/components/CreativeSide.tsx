import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CREATIVE_FACETS } from '../data/portfolioData';

export const CreativeSide: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section id="creative" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#D4AF7A] mb-3">
            CREATIVE PERSONALITY
          </div>
          <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3] max-w-3xl hover-blue-gradient cursor-default">
            Beyond Conventional Finance —{' '}
            <span className="font-editorial italic font-normal lowercase text-[#7EC4D8]">
              a multidisciplinary mind
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CREATIVE_FACETS.map((facet, idx) => {
            const isActive = idx === activeIdx;
            return (
              <motion.button
                key={facet.title}
                type="button"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className={`text-left rounded-2xl p-7 transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1A4B5E]/90 to-[#0A232E]/95 shadow-[0_24px_55px_rgba(0,0,0,0.45)] -translate-y-1'
                    : 'bg-[#081C26]/70 hover:bg-[#0E2B39]/80'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#D4AF7A]">
                    0{idx + 1} · {facet.subtitle}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      isActive ? 'bg-[#7EC4D8]' : 'bg-white/20'
                    }`}
                  />
                </div>
                <h3 className="font-condensed text-2xl font-bold uppercase tracking-wide text-[#EFECE3] mb-3">
                  {facet.title}
                </h3>
                <p className="text-sm text-[#98B2BD] leading-relaxed">{facet.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
