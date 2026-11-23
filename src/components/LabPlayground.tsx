import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LAB_CATEGORIES, LAB_MODULES, type LabCategory, type LabModule } from '../data/labsData';
import { LabCard } from './LabCard';

interface LabPlaygroundProps {
  onSelectLab: (lab: LabModule) => void;
}

export const LabPlayground: React.FC<LabPlaygroundProps> = ({ onSelectLab }) => {
  const [activeCategory, setActiveCategory] = useState<LabCategory>('All');

  const filteredLabs = useMemo(() => {
    if (activeCategory === 'All') return LAB_MODULES;
    return LAB_MODULES.filter((lab) => lab.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="labs" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header & Segmented Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="max-w-xl">
            <p className="text-xs font-mono text-sky-300 tracking-wide">
              01. Interactive Lab Modules
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
              Engineering &amp; Architecture Playground
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Select any module to open its interactive schematic inspector, trace live data-flow
              paths, and review benchmark metrics.
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter lab modules by engineering domain"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-800/90 bg-[#0F172A]/90 p-1 self-start lg:self-auto"
          >
            {LAB_CATEGORIES.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`relative rounded-lg px-3.5 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isActive ? 'text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeLabTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-lg bg-sky-400"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filterable Grid */}
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} onSelect={onSelectLab} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
