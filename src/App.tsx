import React from 'react';
import { HeroAnim } from './components/HeroAnim';
import { ChapterNav } from './components/ChapterNav';
import { JourneyAndEducation } from './components/JourneyAndEducation';
import { QualificationsAndSkills } from './components/QualificationsAndSkills';
import { ProjectUniverse } from './components/ProjectUniverse';
import { CreativeSide } from './components/CreativeSide';
import { BackgroundBeatAudio } from './components/BackgroundBeatAudio';
import { ContactSection } from './components/ContactSection';
import { PROFILE } from './data/portfolioData';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen text-[#EFECE3]">
      {/* Subtle cinematic film grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* Background music & live beat visualizer */}
      <BackgroundBeatAudio />

      {/* Chapter navigation rail */}
      <ChapterNav />

      <main className="relative z-10">
        {/* 01 — Introduction (Signature Transparent Cursor-Controlled Character Hero) */}
        <HeroAnim />

        {/* 02 — My Journey, 03 — Education, 04 — Experience */}
        <JourneyAndEducation />

        {/* 05 — Qualifications & Skills */}
        <QualificationsAndSkills />

        {/* 06 — Project Universe & 3D Animated Books */}
        <ProjectUniverse />

        {/* 07 — Creative Personality */}
        <CreativeSide />

        {/* 08 — Contact & Real Email Delivery */}
        <ContactSection />
      </main>

      <footer className="relative z-10 border-t border-[#EFECE3]/10 bg-[#051218]/90 py-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-[11px] tracking-[0.16em] uppercase text-[#98B2BD]">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
