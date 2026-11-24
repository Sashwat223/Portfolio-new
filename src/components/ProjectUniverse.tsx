import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BOOKS, PROJECTS, type BookItem, type ProjectItem } from '../data/portfolioData';
import { BookOpen, Cpu, MessageSquare, RotateCw, Terminal } from 'lucide-react';

const ProjectVisualPreview: React.FC<{ project: ProjectItem }> = ({ project }) => {
  if (project.id === 'nuvio-ai') {
    return (
      <div className="relative h-full min-h-[260px] rounded-2xl bg-[#06151D]/90 p-6 flex flex-col justify-between shadow-inner">
        <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#D4AF7A]">
          <span className="inline-flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            HYBRID EXTRACTION PIPELINE
          </span>
          <span>TWO-STAGE AI</span>
        </div>

        <div className="my-6 space-y-3">
          <div className="rounded-xl bg-[#0D2A37]/80 p-3.5 flex items-center justify-between">
            <span className="font-mono-tech text-xs text-[#EFECE3]">Local AI / ML Engine</span>
            <span className="font-mono-tech text-[10px] text-[#7EC4D8] px-2 py-0.5 rounded bg-[#7EC4D8]/15">
              STRUCTURED PARSING
            </span>
          </div>
          <div className="flex justify-center">
            <div className="h-4 w-[1px] bg-[#D4AF7A]/50" />
          </div>
          <div className="rounded-xl bg-[#D4AF7A]/15 p-3.5 flex items-center justify-between">
            <span className="font-mono-tech text-xs text-[#EFECE3]">Gemini Review Pass</span>
            <span className="font-mono-tech text-[10px] text-[#D4AF7A] px-2 py-0.5 rounded bg-[#D4AF7A]/20">
              GAP DETECTION
            </span>
          </div>
        </div>

        <div className="font-mono-tech text-[10px] text-[#98B2BD] flex items-center justify-between">
          <span>CANDIDATE PROFILE VERIFICATION</span>
          <span className="text-[#D4AF7A]">READY</span>
        </div>
      </div>
    );
  }

  if (project.id === 'agenthub') {
    return (
      <div className="relative h-full min-h-[260px] rounded-2xl bg-[#06151D]/90 p-6 flex flex-col justify-between shadow-inner">
        <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#7EC4D8]">
          <span className="inline-flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            WHATSAPP AUTOMATION ENGINE
          </span>
          <span>BUSINESS WORKFLOWS</span>
        </div>

        <div className="my-6 space-y-2.5">
          <div className="rounded-xl bg-[#0D2A37]/70 px-4 py-3 text-xs text-[#98B2BD]">
            <span className="text-[#7EC4D8] font-mono-tech mr-2">INBOUND</span>
            Automated client inquiry &amp; intent routing
          </div>
          <div className="rounded-xl bg-[#7EC4D8]/15 px-4 py-3 text-xs text-[#EFECE3]">
            <span className="text-[#7EC4D8] font-mono-tech mr-2">WORKFLOW</span>
            Instant structured response &amp; startup CRM sync
          </div>
          <div className="rounded-xl bg-[#0D2A37]/70 px-4 py-3 text-xs text-[#98B2BD]">
            <span className="text-[#D4AF7A] font-mono-tech mr-2">OUTCOME</span>
            24/7 reliable business communication
          </div>
        </div>

        <div className="font-mono-tech text-[10px] text-[#98B2BD]">BUILT FOR BUSINESSES &amp; STARTUPS</div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[260px] rounded-2xl bg-[#06151D]/90 p-6 flex flex-col justify-between shadow-inner">
      <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#D4AF7A]">
        <span className="inline-flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          FULL-STACK DELIVERY
        </span>
        <span>CLIENT SYSTEMS</span>
      </div>

      <div className="my-6 grid grid-cols-2 gap-3">
        {['Web Architecture', 'AI Integration', 'Workflow Automation', 'Custom Tooling'].map((cap) => (
          <div
            key={cap}
            className="rounded-xl bg-[#0D2A37]/75 p-3.5 font-mono-tech text-[11px] text-[#EFECE3]/90"
          >
            {cap}
          </div>
        ))}
      </div>

      <div className="font-mono-tech text-[10px] text-[#98B2BD]">PRODUCTION SOFTWARE SOLUTIONS</div>
    </div>
  );
};

/**
 * 6-sided 3D hardcover book model with spine typography, layered page blocks,
 * embossed foil edge detailing, continuous floating animation, and interactive 3D tilt/flip.
 */
const HardcoverBook3D: React.FC<{ book: BookItem }> = ({ book }) => {
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 6, ry: -22 });
  const containerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 24,
      ry: (px - 0.5) * 38,
    });
  };

  const depth = 30; // 3D hardcover thickness in px
  const halfDepth = depth / 2;

  return (
    <div
      className="rounded-3xl p-7 sm:p-10 flex flex-col lg:flex-row gap-10 items-center shadow-[0_28px_65px_rgba(0,0,0,0.45)]"
      style={{
        background:
          'linear-gradient(135deg, rgba(22, 65, 82, 0.65) 0%, rgba(8, 26, 35, 0.92) 100%)',
      }}
    >
      {/* 6-Sided 3D Hardcover Book Stage */}
      <div
        ref={containerRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setTilt({ rx: 6, ry: -22 });
        }}
        onMouseMove={onMouseMove}
        className="perspective-1200 shrink-0 py-6 px-6 relative flex flex-col items-center"
      >
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={`Rotate 3D hardcover book ${book.title}`}
          className={`relative w-[185px] sm:w-[205px] h-[278px] sm:h-[308px] preserve-3d transition-transform duration-500 ease-out cursor-pointer focus:outline-none ${
            !hovered && !flipped ? 'book-float-idle' : ''
          }`}
          style={
            flipped
              ? { transform: 'rotateY(180deg) rotateX(4deg)' }
              : hovered
              ? { transform: `rotateY(${tilt.ry}deg) rotateX(${tilt.rx}deg) scale(1.05)` }
              : undefined
          }
        >
          {/* 1. Front Cover */}
          <div
            className="absolute inset-0 backface-hidden rounded-r-md rounded-l-[2px] overflow-hidden shadow-[0_28px_55px_rgba(0,0,0,0.75)] border border-white/15"
            style={{ transform: `translateZ(${halfDepth}px)` }}
          >
            <img
              src={book.frontCover}
              alt={`${book.title} front cover`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {/* Binding crease groove */}
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/55 via-white/10 to-transparent" />
            {/* Glossy studio light sweep */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
          </div>

          {/* 2. Back Cover */}
          <div
            className="absolute inset-0 backface-hidden rounded-l-md rounded-r-[2px] overflow-hidden shadow-[0_28px_55px_rgba(0,0,0,0.75)] border border-white/15"
            style={{ transform: `rotateY(180deg) translateZ(${halfDepth}px)` }}
          >
            <img
              src={book.backCover}
              alt={`${book.title} back cover`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/50 to-transparent" />
          </div>

          {/* 3. Left Spine (with vertical title & gold foil bands) */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 flex items-center justify-center overflow-hidden border-y border-white/10"
            style={{
              width: `${depth}px`,
              transform: `rotateY(-90deg) translateZ(${halfDepth}px)`,
              transformOrigin: 'center center',
              marginLeft: `-${halfDepth}px`,
              background: 'linear-gradient(90deg, #0b1f29 0%, #1a485c 50%, #0d2733 100%)',
            }}
          >
            <div className="w-[240px] -rotate-90 text-center font-condensed text-[11px] tracking-[0.22em] uppercase text-[#EFECE3]/90 truncate px-2">
              {book.title} · S. DHAKAL
            </div>
          </div>

          {/* 4. Right Page Block (realistic stacked paper texture) */}
          <div
            aria-hidden="true"
            className="absolute top-[3px] bottom-[3px] right-0"
            style={{
              width: `${depth - 4}px`,
              transform: `rotateY(90deg) translateZ(${halfDepth - 2}px)`,
              transformOrigin: 'center center',
              marginRight: `-${halfDepth - 2}px`,
              backgroundColor: '#E7E1D3',
              backgroundImage:
                'repeating-linear-gradient(to right, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* 5. Top Page Block */}
          <div
            aria-hidden="true"
            className="absolute left-[2px] right-[2px] top-0"
            style={{
              height: `${depth - 4}px`,
              transform: `rotateX(90deg) translateZ(${halfDepth - 2}px)`,
              transformOrigin: 'center center',
              marginTop: `-${halfDepth - 2}px`,
              backgroundColor: '#DED7C8',
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
            }}
          />

          {/* 6. Bottom Page Block */}
          <div
            aria-hidden="true"
            className="absolute left-[2px] right-[2px] bottom-0"
            style={{
              height: `${depth - 4}px`,
              transform: `rotateX(-90deg) translateZ(${halfDepth - 2}px)`,
              transformOrigin: 'center center',
              marginBottom: `-${halfDepth - 2}px`,
              backgroundColor: '#D4CCB9',
            }}
          />
        </button>

        {/* Realistic ambient pedestal shadow underneath */}
        <div
          aria-hidden="true"
          className="mt-5 w-40 h-3 rounded-full bg-black/60 blur-md"
        />
      </div>

      {/* Book Editorial Details */}
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[#D4AF7A] mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          AMAZON KDP · PUBLISHED AUTHOR
        </div>
        <h4 className="font-condensed text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#EFECE3]">
          {book.title}
        </h4>
        <p className="mt-1 font-editorial italic text-xl text-[#7EC4D8]">{book.subtitle}</p>
        <p className="mt-4 text-sm text-[#98B2BD] leading-relaxed">{book.description}</p>

        <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFECE3]/10 hover:bg-[#D4AF7A]/25 text-xs font-mono-tech uppercase tracking-[0.15em] text-[#EFECE3] transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#D4AF7A]" />
            {flipped ? 'View Front Cover' : 'Flip 3D Book'}
          </button>
          <span className="font-mono-tech text-[11px] text-[#98B2BD]">ISBN {book.isbn}</span>
        </div>
      </div>
    </div>
  );
};

export const ProjectUniverse: React.FC = () => {
  return (
    <section id="projects" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[#06161E]/75">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-16 md:mb-20"
        >
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[#D4AF7A] mb-3">
            PROJECT UNIVERSE
          </div>
          <h2 className="font-condensed text-4xl sm:text-6xl font-bold uppercase tracking-wide text-[#EFECE3] hover-blue-gradient cursor-default">
            Systems, Automation &amp; Published Works
          </h2>
        </motion.div>

        <div className="space-y-10 mb-24">
          {PROJECTS.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.75, delay: idx * 0.08 }}
              className="rounded-3xl p-7 sm:p-10 shadow-[0_28px_65px_rgba(0,0,0,0.45)]"
              style={{
                background:
                  'linear-gradient(125deg, rgba(20, 58, 74, 0.65) 0%, rgba(8, 25, 34, 0.92) 65%)',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[#7EC4D8]">
                    {project.category}
                  </div>
                  <div>
                    <h3 className="font-condensed text-3xl sm:text-5xl font-bold uppercase tracking-wide text-[#EFECE3]">
                      {project.name}
                    </h3>
                    <p className="mt-1 font-editorial italic text-xl text-[#D4AF7A]">{project.tagline}</p>
                  </div>

                  <p className="text-sm sm:text-base text-[#98B2BD] leading-relaxed">{project.introduction}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="rounded-xl bg-[#06151D]/80 p-4">
                      <div className="font-mono-tech text-[10px] tracking-[0.18em] uppercase text-[#7EC4D8] mb-1.5">
                        PROBLEM SOLVED
                      </div>
                      <p className="text-xs text-[#EFECE3]/85 leading-relaxed">{project.problemSolved}</p>
                    </div>
                    <div className="rounded-xl bg-[#06151D]/80 p-4">
                      <div className="font-mono-tech text-[10px] tracking-[0.18em] uppercase text-[#D4AF7A] mb-1.5">
                        WHAT I BUILT
                      </div>
                      <p className="text-xs text-[#EFECE3]/85 leading-relaxed">{project.whatIBuilt}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono-tech text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-[#EFECE3]/[0.07] text-[#7EC4D8]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 h-full">
                  <ProjectVisualPreview project={project} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Author & Publisher 3D Book Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono-tech text-[11px] tracking-[0.22em] uppercase text-[#7EC4D8] mb-2">
                AUTHOR &amp; PUBLISHER
              </div>
              <h3 className="font-condensed text-3xl sm:text-5xl font-bold uppercase tracking-wide text-[#EFECE3]">
                Amazon Kindle Direct Publishing
              </h3>
            </div>
            <p className="text-xs font-mono-tech uppercase tracking-[0.15em] text-[#98B2BD]">
              HOVER OR CLICK TO INSPECT 3D HARDCOVER
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {BOOKS.map((book) => (
              <HardcoverBook3D key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
