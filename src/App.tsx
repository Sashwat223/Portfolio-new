import React, { useEffect, useState } from 'react';
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
  const [journeyUnlocked, setJourneyUnlocked] = useState(false);

  // Lock page scrolling until the visitor clicks "My Journey"
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (!journeyUnlocked) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, [journeyUnlocked]);

  const handleEnterJourney = () => {
    // Trigger audio playback synchronously within the user's click gesture
    window.dispatchEvent(new CustomEvent('start-journey-audio'));
    setJourneyUnlocked(true);
    requestAnimationFrame(() => {
      document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="relative min-h-screen text-[#EFECE3]">
      {/* Subtle cinematic film grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* Background music & live beat visualizer */}
      <BackgroundBeatAudio />

      {/* Chapter navigation rail (visible once journey is unlocked) */}
      {journeyUnlocked && <ChapterNav />}

      <main className="relative z-10">
        {/* Hero with "My Journey" entry button */}
        <HeroAnim onEnterJourney={handleEnterJourney} journeyUnlocked={journeyUnlocked} />

        {/* My Journey, Education, Experience */}
        <JourneyAndEducation />

        {/* Qualifications & Skills */}
        <QualificationsAndSkills />

        {/* Project Universe & 3D Animated Books */}
        <ProjectUniverse />

        {/* Creative Personality */}
        <CreativeSide />

        {/* Contact & Real Email Delivery */}
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
