import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { LabModule } from '../data/labsData';

interface LabCardProps {
  lab: LabModule;
  onSelect: (lab: LabModule) => void;
}

const TONE_COLOR: Record<'cyan' | 'indigo' | 'emerald', string> = {
  cyan: '#38BDF8',
  indigo: '#818CF8',
  emerald: '#34D399',
};

export const LabCard: React.FC<LabCardProps> = ({ lab, onSelect }) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = cardRef.current;
    if (!el || shouldReduceMotion) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    el.style.setProperty('--lx', `${x}px`);
    el.style.setProperty('--ly', `${y}px`);
    el.style.transform = `perspective(950px) rotateX(${(-py * 5.5).toFixed(2)}deg) rotateY(${(
      px * 5.5
    ).toFixed(2)}deg) translateY(-4px)`;
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(950px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const nodeMap = new Map(lab.diagram.nodes.map((n) => [n.id, n]));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <button
        ref={cardRef}
        type="button"
        onClick={() => onSelect(lab)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms ease',
        }}
        className="group relative flex h-full w-full flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#0F172A]/85 p-6 text-left cursor-pointer hover:border-sky-400/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 overflow-hidden"
      >
        {/* Local pointer spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background:
              'radial-gradient(380px circle at var(--lx, 50%) var(--ly, 50%), rgba(56, 189, 248, 0.11), transparent 70%)',
          }}
        />

        <div className="relative z-10 w-full">
          {/* Unboxed Metadata Kicker */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <span className="truncate">
              <span className="text-sky-300 font-medium">{lab.id}</span>
              <span className="mx-1.5 text-slate-600" aria-hidden="true">·</span>
              <span>{lab.category}</span>
            </span>
            <span className="text-emerald-400 tabular-nums whitespace-nowrap shrink-0">
              {lab.primaryMetric}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold text-slate-50 leading-snug group-hover:text-sky-200 transition-colors duration-150">
            {lab.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-400 line-clamp-3">
            {lab.summary}
          </p>

          {/* Clean Inline SVG Architecture Schematic Preview */}
          <div className="mt-5 rounded-xl bg-[#090D16]/90 border border-slate-800/80 p-3">
            <svg
              viewBox="0 0 720 300"
              className="w-full h-24 select-none"
              aria-hidden="true"
            >
              {lab.diagram.edges.map((edge, idx) => {
                const from = nodeMap.get(edge.from);
                const to = nodeMap.get(edge.to);
                if (!from || !to) return null;
                return (
                  <line
                    key={idx}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={edge.isFailover ? 'rgba(129, 140, 248, 0.32)' : 'rgba(56, 189, 248, 0.38)'}
                    strokeWidth="2.5"
                    strokeDasharray={edge.isFailover ? '6 6' : undefined}
                  />
                );
              })}

              {lab.diagram.nodes.map((node) => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <rect
                    x="-54"
                    y="-22"
                    width="108"
                    height="44"
                    rx="8"
                    fill="#111827"
                    stroke={TONE_COLOR[node.tone]}
                    strokeOpacity="0.65"
                    strokeWidth="2"
                  />
                  <circle cx="-38" cy="0" r="4" fill={TONE_COLOR[node.tone]} />
                  <rect x="-26" y="-5" width="64" height="4" rx="2" fill="#CBD5E1" fillOpacity="0.65" />
                  <rect x="-26" y="4" width="42" height="3" rx="1.5" fill="#64748B" fillOpacity="0.65" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Unboxed Tech Stack & Inspect Action */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/75 flex items-center justify-between gap-3 w-full">
          <p className="text-xs font-mono text-slate-400 truncate">
            {lab.techStack.slice(0, 3).join(' · ')}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 group-hover:text-sky-200 whitespace-nowrap shrink-0">
            <span>Inspect</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </button>
    </motion.div>
  );
};
