import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { TIMELINE_MILESTONES } from '../data/timelineData';

export const JourneyTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 70%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section id="journey" className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-mono text-indigo-300 tracking-wide">
            02. Engineering Progression
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
            Journey &amp; Milestone Timeline
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            From foundational Linux networking and container isolation to declarative GitOps
            pipelines, kernel observability, and kinetic web interfaces.
          </p>
        </div>

        {/* Scroll-Linked Vertical Spine & Milestones */}
        <div ref={containerRef} className="relative pl-8 sm:pl-12">
          {/* Background track line */}
          <div
            aria-hidden="true"
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-slate-800"
          />

          {/* Scroll-linked glowing progress line (compositor scaleY only) */}
          <motion.div
            aria-hidden="true"
            style={{
              scaleY: shouldReduceMotion ? 1 : smoothProgress,
              transformOrigin: 'top',
            }}
            className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-sky-400 via-indigo-400 to-emerald-400"
          />

          <div className="space-y-10">
            {TIMELINE_MILESTONES.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.06, 0.24),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                {/* Stage Marker Node on Spine */}
                <div
                  aria-hidden="true"
                  className="absolute -left-8 sm:-left-12 top-1.5 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-sky-400/50 bg-[#090D16] font-mono text-[11px] font-semibold text-sky-300 tabular-nums"
                >
                  {item.id}
                </div>

                {/* Milestone Card */}
                <div className="rounded-2xl border border-slate-800/90 bg-[#0F172A]/75 p-6 sm:p-7 hover:border-slate-700 transition-colors duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-sky-300 font-medium">{item.stage}</span>
                    <span className="text-slate-400 tabular-nums">{item.period}</span>
                  </div>

                  <div className="mt-3 flex flex-col lg:flex-row lg:items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-slate-50">
                      {item.role}
                    </h3>
                    <span className="text-xs font-mono text-indigo-300 shrink-0">
                      {item.focus}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-slate-800/75 pt-4">
                    {item.highlights.map((hl, hIdx) => (
                      <li
                        key={hIdx}
                        className="text-sm text-slate-400 leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="font-mono text-emerald-400 text-xs mt-0.5" aria-hidden="true">
                          —
                        </span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs font-mono text-slate-400">
                    {item.stack}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
