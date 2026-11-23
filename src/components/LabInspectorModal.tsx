import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Play, Pause, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { LabModule, DiagramNode } from '../data/labsData';

interface LabInspectorModalProps {
  lab: LabModule | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

type FlowMode = 'normal' | 'failover' | 'paused';

const TONE_STROKE: Record<DiagramNode['tone'], string> = {
  cyan: '#38BDF8',
  indigo: '#818CF8',
  emerald: '#34D399',
};

export const LabInspectorModal: React.FC<LabInspectorModalProps> = ({
  lab,
  onClose,
  onNavigate,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [flowMode, setFlowMode] = useState<FlowMode>('normal');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!lab) return;
    setSelectedNodeId(lab.diagram.nodes[0]?.id ?? null);
    setFlowMode(shouldReduceMotion ? 'paused' : 'normal');
  }, [lab, shouldReduceMotion]);

  useEffect(() => {
    if (!lab) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lab, onClose, onNavigate]);

  if (!lab) return null;

  const nodeMap = new Map(lab.diagram.nodes.map((n) => [n.id, n]));
  const activeNode =
    lab.diagram.nodes.find((n) => n.id === selectedNodeId) ?? lab.diagram.nodes[0];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspector-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#05080F]/80 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Surface */}
        <motion.div
          key={lab.id}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/80 bg-[#0F172A] shadow-2xl shadow-black/70"
        >
          {/* Sticky Inspector Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur-md px-6 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-sky-300 font-semibold">{lab.id}</span>
                <span aria-hidden="true">·</span>
                <span>{lab.category}</span>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline">{lab.environment}</span>
              </div>
              <h2
                id="inspector-modal-title"
                className="font-display text-lg sm:text-xl font-bold text-slate-50 truncate mt-0.5"
              >
                {lab.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('prev')}
                aria-label="Previous lab module"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 text-slate-300 hover:border-sky-400/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('next')}
                aria-label="Next lab module"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 text-slate-300 hover:border-sky-400/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close inspector modal"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Interactive Architecture Diagram Canvas */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Interactive Architecture Diagram
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lab.diagram.caption} — Click any node to inspect its role &amp; protocol.
                  </p>
                </div>

                {/* Flow Mode Controls */}
                <div className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-[#090D16] p-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setFlowMode('normal')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      flowMode === 'normal'
                        ? 'bg-sky-400 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    <span>Standard Flow</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowMode('failover')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      flowMode === 'failover'
                        ? 'bg-indigo-400 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    <span>Failover Path</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowMode('paused')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      flowMode === 'paused'
                        ? 'bg-slate-700 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <Pause className="h-3 w-3" aria-hidden="true" />
                    <span>Pause</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#090D16] p-3 sm:p-4 overflow-x-auto">
                <svg
                  viewBox="0 0 720 300"
                  className="w-full min-w-[540px] h-auto select-none"
                  role="img"
                  aria-label={`Architecture flow diagram for ${lab.title}`}
                >
                  <defs>
                    <marker
                      id="arrow-cyan"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38BDF8" />
                    </marker>
                    <marker
                      id="arrow-indigo"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#818CF8" />
                    </marker>
                  </defs>

                  {/* Edges & Animated Data Packets */}
                  {lab.diagram.edges.map((edge, idx) => {
                    const from = nodeMap.get(edge.from);
                    const to = nodeMap.get(edge.to);
                    if (!from || !to) return null;

                    const dx = to.x - from.x;
                    const dy = to.y - from.y;
                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;
                    // Slight curve offset for parallel bi-directional edges
                    const curveOffset = edge.isFailover ? 28 : dy === 0 ? -18 : 12;
                    const cx = midX;
                    const cy = midY + curveOffset;
                    const pathId = `lab-edge-${lab.id}-${idx}`;
                    const pathD = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

                    const isHighlighted =
                      flowMode === 'failover' ? Boolean(edge.isFailover) : !edge.isFailover;
                    const isAnimating = flowMode !== 'paused' && isHighlighted;

                    const strokeColor = edge.isFailover
                      ? flowMode === 'failover'
                        ? '#818CF8'
                        : 'rgba(129, 140, 248, 0.22)'
                      : flowMode === 'failover'
                      ? 'rgba(56, 189, 248, 0.18)'
                      : '#38BDF8';

                    return (
                      <g key={pathId}>
                        <path
                          id={pathId}
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isHighlighted ? '2' : '1.25'}
                          className={
                            isAnimating
                              ? flowMode === 'failover'
                                ? 'animate-flow-dash-fast'
                                : 'animate-flow-dash'
                              : undefined
                          }
                          markerEnd={
                            edge.isFailover ? 'url(#arrow-indigo)' : 'url(#arrow-cyan)'
                          }
                        />

                        {/* Edge label */}
                        <text
                          x={cx}
                          y={cy - 6}
                          textAnchor="middle"
                          fill={isHighlighted ? '#CBD5E1' : '#64748B'}
                          fontSize="9.5"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {edge.label}
                        </text>

                        {/* Animated traveling data pulse */}
                        {isAnimating && (
                          <circle
                            r="3.5"
                            fill={edge.isFailover ? '#818CF8' : '#34D399'}
                          >
                            <animateMotion
                              dur={flowMode === 'failover' ? '1.35s' : '2.1s'}
                              repeatCount="indefinite"
                            >
                              <mpath href={`#${pathId}`} />
                            </animateMotion>
                          </circle>
                        )}
                      </g>
                    );
                  })}

                  {/* Interactive Nodes */}
                  {lab.diagram.nodes.map((node) => {
                    const isSelected = activeNode?.id === node.id;
                    const accent = TONE_STROKE[node.tone];
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={() => setSelectedNodeId(node.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedNodeId(node.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select node ${node.label}`}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <rect
                            x="-72"
                            y="-32"
                            width="144"
                            height="64"
                            rx="13"
                            fill="none"
                            stroke={accent}
                            strokeOpacity="0.4"
                            strokeWidth="2"
                          />
                        )}
                        <rect
                          x="-66"
                          y="-26"
                          width="132"
                          height="52"
                          rx="10"
                          fill={isSelected ? '#17233A' : '#111827'}
                          stroke={isSelected ? accent : 'rgba(148, 163, 184, 0.3)'}
                          strokeWidth={isSelected ? '1.8' : '1.1'}
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fill="#F8FAFC"
                          fontSize="11.5"
                          fontWeight="600"
                          fontFamily="Outfit, sans-serif"
                        >
                          {node.label}
                        </text>
                        <text
                          x="0"
                          y="13"
                          textAnchor="middle"
                          fill={accent}
                          fontSize="9.5"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.sublabel}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Active Node Telemetry Inspector Bar */}
              {activeNode && (
                <div className="mt-3 rounded-xl border border-slate-800/90 bg-[#111827]/75 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-sky-300 font-semibold">{activeNode.label}</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-300">{activeNode.role}</span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-emerald-400">{activeNode.protocol}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {activeNode.detail}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Problem & Solution Two-Column Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800/80 pt-6">
              <div>
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Problem &amp; Constraint
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{lab.problem}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-sky-300 uppercase tracking-wider">
                  Architectural Solution
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{lab.solution}</p>
              </div>
            </div>

            {/* Verified Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-800/80 py-5">
              {lab.metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-xs text-slate-400">{m.label}</div>
                  <div className="mt-1 font-mono text-2xl font-semibold text-slate-50 tabular-nums">
                    {m.value}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">{m.context}</div>
                </div>
              ))}
            </div>

            {/* Takeaways & Unboxed Tech Stack */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">
                  Key Engineering Takeaways
                </h3>
                <ul className="space-y-2.5">
                  {lab.takeaways.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed"
                    >
                      <CheckCircle2
                        className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-4 md:border-l md:border-slate-800/80 md:pl-6">
                <h3 className="text-sm font-semibold text-slate-100 mb-3">
                  Stack &amp; Tooling
                </h3>
                <p className="text-xs font-mono leading-7 text-slate-300">
                  {lab.techStack.join(' · ')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
