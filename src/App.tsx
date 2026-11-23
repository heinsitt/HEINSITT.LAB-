import { useEffect, useRef, useState, useCallback } from 'react';
import { MotionConfig } from 'motion/react';
import { LAB_MODULES, type LabModule } from './data/labsData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LabPlayground } from './components/LabPlayground';
import { JourneyTimeline } from './components/JourneyTimeline';
import { LabInspectorModal } from './components/LabInspectorModal';
import { Footer } from './components/Footer';

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedLab, setSelectedLab] = useState<LabModule | null>(null);

  // Damped requestAnimationFrame lerp cursor spotlight (zero React re-renders)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    let targetX = window.innerWidth * 0.55;
    let targetY = 260;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;
    let isRunning = false;

    const updateSpotlight = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.085;
      currentY += dy * 0.085;

      el.style.setProperty('--mx', `${currentX.toFixed(1)}px`);
      el.style.setProperty('--my', `${currentY.toFixed(1)}px`);

      if (Math.abs(dx) > 0.35 || Math.abs(dy) > 0.35) {
        rafId = window.requestAnimationFrame(updateSpotlight);
      } else {
        isRunning = false;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY + window.scrollY;
      if (!isRunning) {
        isRunning = true;
        rafId = window.requestAnimationFrame(updateSpotlight);
      }
    };

    const handleScroll = () => {
      if (!isRunning) {
        el.style.setProperty('--my', `${(currentY + window.scrollY * 0.05).toFixed(1)}px`);
      }
    };

    el.style.setProperty('--mx', `${currentX}px`);
    el.style.setProperty('--my', `${currentY}px`);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavigateLab = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedLab) return;
      const currentIdx = LAB_MODULES.findIndex((item) => item.id === selectedLab.id);
      if (currentIdx === -1) return;
      const nextIdx =
        direction === 'next'
          ? (currentIdx + 1) % LAB_MODULES.length
          : (currentIdx - 1 + LAB_MODULES.length) % LAB_MODULES.length;
      setSelectedLab(LAB_MODULES[nextIdx]);
    },
    [selectedLab]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="relative min-h-screen bg-[#090D16] text-slate-100 overflow-x-clip"
      >
        {/* Subtle Architectural Dot Matrix & Hairline Grid Backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 studio-dot-grid opacity-75"
        />

        {/* Smooth Damped Cursor-Following Ambient Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(620px circle at var(--mx, 55%) var(--my, 240px), rgba(56, 189, 248, 0.095), rgba(129, 140, 248, 0.045) 42%, transparent 72%)',
          }}
        />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar onOpenFeaturedLab={() => setSelectedLab(LAB_MODULES[0])} />

          <main className="flex-1">
            <HeroSection onInspectLab={(lab) => setSelectedLab(lab)} />
            <LabPlayground onSelectLab={(lab) => setSelectedLab(lab)} />
            <JourneyTimeline />
          </main>

          <Footer />
        </div>

        {/* Interactive Lab Inspector Modal */}
        <LabInspectorModal
          lab={selectedLab}
          onClose={() => setSelectedLab(null)}
          onNavigate={handleNavigateLab}
        />
      </div>
    </MotionConfig>
  );
}
