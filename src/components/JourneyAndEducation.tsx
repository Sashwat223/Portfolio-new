import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EDUCATION, EXPERIENCES, PROFILE, type EducationItem } from '../data/portfolioData';
import { ArrowUpRight, Briefcase, GraduationCap, MapPin } from 'lucide-react';

const TiltMonolith: React.FC<{ edu: EducationItem; index: number }> = ({ edu, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 12,
      gx: px * 100,
      gy: py * 100,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1200"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(126, 196, 216, 0.16), rgba(9, 32, 43, 0.88) 65%)`,
        }}
        className="relative rounded-3xl p-8 md:p-11 transition-transform duration-200 ease-out shadow-[0_30px_70px_rgba(0,0,0,0.45)] overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -bottom-6 font-condensed text-[110px] md:text-[140px] font-bold leading-none text-[#EFECE3]/[0.04] select-none"
        >
          {edu.isOngoing ? '2026' : '2022'}
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 mb-7">
          <div className="inline-flex items-center gap-2.5 font-mono-tech text-xs tracking-[0.18em] uppercase text-[#7EC4D8]">
            <GraduationCap className="w-4 h-4" />
            <span>{edu.period}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {edu.isOngoing && <span className="h-2 w-2 rounded-full bg-[#D4AF7A] animate-pulse" />}
            <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#D4AF7A]">
              {edu.isOngoing ? 'IN PROGRESS' : 'COMPLETED'}
            </span>
          </div>
        </div>

        <h3 className="relative z-10 font-condensed text-3xl sm:text-4xl font-bold tracking-wide text-[#EFECE3] uppercase leading-tight">
          {edu.degree}
        </h3>
        <p className="relative z-10 mt-2 font-editorial italic text-xl text-[#D4AF7A]">
          {edu.institution} · {edu.location}
        </p>

        {edu.isOngoing && (
          <div className="relative z-10 mt-5">
            <div className="flex justify-between font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[#98B2BD] mb-1.5">
              <span>DEGREE COMPLETION</span>
              <span className="text-[#EFECE3]">FINAL SEMESTER · 2026</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '88%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-[#7EC4D8] to-[#D4AF7A]"
              />
            </div>
          </div>
        )}

        <p className="relative z-10 mt-6 text-sm text-[#98B2BD] leading-relaxed max-w-lg">{edu.details}</p>
      </div>
    </motion.div>
  );
};

export const JourneyAndEducation: React.FC = () => {
  const [activeExpIdx, setActiveExpIdx] = useState(0);
  const activeExp = EXPERIENCES[activeExpIdx];

  return (
    <>
      {/* MY JOURNEY */}
      <section
        id="journey"
        className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[#081A23]/80 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#7EC4D8] mb-6">
            MY JOURNEY
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75 }}
              className="lg:col-span-7"
            >
              <h2 className="font-condensed text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight leading-[0.95] text-[#EFECE3] hover-blue-gradient cursor-default">
                From structured banking &amp; operations to{' '}
                <span className="font-editorial italic font-normal lowercase text-[#7EC4D8]">
                  applied AI &amp; digital craft.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="lg:col-span-5 space-y-6 text-[#98B2BD] text-base md:text-lg leading-relaxed"
            >
              <p>
                Based in {PROFILE.location}, my path spans three years of administration at Birat Biotech, assessment
                operations with the British Council Nepal, and trade finance workflows at Nabil Bank Limited.
              </p>
              <p>
                Alongside my BBA studies, I build AI-powered HR screening pipelines, WhatsApp business automation
                platforms, and publish original books on Amazon KDP.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono-tech uppercase tracking-[0.16em] text-[#EFECE3]/85">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF7A]" />
                  {PROFILE.location}
                </span>
                <a
                  href={PROFILE.cvPath}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#7EC4D8] hover:text-[#D4AF7A] transition-colors"
                >
                  View Official CV <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="relative py-24 md:py-36 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#7EC4D8] mb-3">
                EDUCATION
              </div>
              <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3]">
                Academic Foundation
              </h2>
            </div>
            <p className="font-mono-tech text-[11px] tracking-[0.16em] uppercase text-[#98B2BD]">
              INTERACTIVE 3D ACADEMIC MONOLITHS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EDUCATION.map((edu, idx) => (
              <TiltMonolith key={edu.degree} edu={edu} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[#06161E]/70">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#D4AF7A] mb-3">
              EXPERIENCE
            </div>
            <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3]">
              Institutional &amp; Operational Track
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              {EXPERIENCES.map((exp, idx) => {
                const isSelected = idx === activeExpIdx;
                return (
                  <button
                    key={`${exp.organization}-${exp.role}`}
                    type="button"
                    onClick={() => setActiveExpIdx(idx)}
                    className={`group text-left rounded-2xl px-6 py-5 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1A4B5E]/90 to-[#0E2F3D]/80 shadow-[0_20px_45px_rgba(0,0,0,0.4)] translate-x-1.5'
                        : 'bg-[#09202B]/50 hover:bg-[#0E2C3A]/70 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#7EC4D8] mb-1.5">
                      <span>{exp.type}</span>
                      <span className={isSelected ? 'text-[#D4AF7A]' : 'text-[#98B2BD]'}>{exp.period}</span>
                    </div>
                    <div className="font-condensed text-2xl font-bold uppercase tracking-wide text-[#EFECE3]">
                      {exp.organization}
                    </div>
                    <div className="text-xs text-[#98B2BD] mt-0.5">{exp.role}</div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 perspective-1200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeExp.organization}-${activeExp.role}`}
                  initial={{ opacity: 0, rotateY: -8, y: 12 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  exit={{ opacity: 0, rotateY: 8, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-full rounded-3xl p-8 sm:p-11 shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(26, 75, 94, 0.72) 0%, rgba(10, 34, 45, 0.94) 60%, rgba(6, 20, 27, 0.98) 100%)',
                  }}
                >
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[#D4AF7A] mb-3">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{activeExp.type}</span>
                    </div>

                    <h3 className="font-condensed text-3xl sm:text-5xl font-bold uppercase tracking-wide text-[#EFECE3]">
                      {activeExp.organization}
                    </h3>
                    {activeExp.department && (
                      <div className="font-editorial italic text-2xl text-[#7EC4D8] mt-1">
                        {activeExp.department}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 font-mono-tech text-xs text-[#98B2BD]">
                      <span className="text-[#EFECE3]">{activeExp.role}</span>
                      <span>·</span>
                      <span>{activeExp.period}</span>
                      <span>·</span>
                      <span>{activeExp.location}</span>
                    </div>

                    <ul className="mt-8 space-y-4">
                      {activeExp.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3.5 text-sm sm:text-base text-[#EFECE3]/90 leading-relaxed"
                        >
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF7A] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative z-10 mt-8 pt-5 border-t border-[#EFECE3]/10 flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#98B2BD]">
                    <span>VERIFIED EXPERIENCE RECORD</span>
                    <span className="text-[#7EC4D8]">{activeExp.period}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
