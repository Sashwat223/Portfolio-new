import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QUALIFICATIONS, SKILL_GROUPS } from '../data/portfolioData';
import { Award, Layers } from 'lucide-react';

export const QualificationsAndSkills: React.FC = () => {
  const [selectedSkillIdx, setSelectedSkillIdx] = useState<number>(0);
  const activeGroup = SKILL_GROUPS[selectedSkillIdx];

  return (
    <section id="qualifications" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#7EC4D8] mb-3">
            QUALIFICATIONS &amp; CAPABILITIES
          </div>
          <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3] hover-blue-gradient cursor-default">
            Verified Credentials &amp; Skill Architecture
          </h2>
        </motion.div>

        {/* Credential Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {QUALIFICATIONS.map((cred, idx) => (
            <motion.div
              key={cred.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="group rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:-translate-y-1"
              style={{
                background:
                  'linear-gradient(145deg, rgba(20, 58, 74, 0.6) 0%, rgba(8, 25, 34, 0.9) 100%)',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono-tech text-[10px] tracking-[0.18em] uppercase text-[#D4AF7A]">
                    {cred.category}
                  </span>
                  <Award className="w-4 h-4 text-[#7EC4D8] group-hover:text-[#D4AF7A] transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#EFECE3] leading-snug">
                  {cred.title}
                </h3>
                <p className="mt-2.5 text-xs text-[#98B2BD] leading-relaxed">{cred.summary}</p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#EFECE3]/10 font-mono-tech text-[11px] text-[#7EC4D8]">
                {cred.issuer}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive 7-Domain Skill Architecture */}
        <div
          className="rounded-3xl p-6 sm:p-10 shadow-[0_28px_65px_rgba(0,0,0,0.45)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(19, 55, 70, 0.7) 0%, rgba(7, 22, 30, 0.94) 100%)',
          }}
        >
          <div className="flex items-center gap-2.5 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[#D4AF7A] mb-8">
            <Layers className="w-4 h-4" />
            <span>INTERACTIVE CAPABILITY MATRIX</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col gap-2">
              {SKILL_GROUPS.map((group, idx) => {
                const isSelected = idx === selectedSkillIdx;
                return (
                  <button
                    key={group.domain}
                    type="button"
                    onClick={() => setSelectedSkillIdx(idx)}
                    className={`text-left px-4 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#7EC4D8]/20 text-[#EFECE3] shadow-sm'
                        : 'bg-[#06161E]/55 text-[#98B2BD] hover:bg-[#0D2A37]/75 hover:text-[#EFECE3]'
                    }`}
                  >
                    <span className="font-display text-sm sm:text-base font-medium">{group.domain}</span>
                    <span className="font-mono-tech text-[10px] opacity-70">0{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-[#06151D]/85 p-7 sm:p-10 min-h-[260px] flex flex-col justify-between">
              <div>
                <div className="font-mono-tech text-[10px] tracking-[0.22em] uppercase text-[#7EC4D8] mb-3">
                  DOMAIN 0{selectedSkillIdx + 1}
                </div>
                <h3 className="font-condensed text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#EFECE3]">
                  {activeGroup.domain}
                </h3>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeGroup.items.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-xl bg-[#0C2632]/80 px-4 py-3.5 text-sm text-[#EFECE3]/90 flex items-center gap-3"
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: activeGroup.accent }}
                    />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
