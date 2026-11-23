import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Layers, GitBranch, Activity, Globe } from 'lucide-react';
import { LAB_MODULES, type LabModule } from '../data/labsData';

interface HeroSectionProps {
  onInspectLab: (lab: LabModule) => void;
}

interface TopologyNodeHotspot {
  id: string;
  labIndex: number;
  label: string;
  sub: string;
  x: number;
  y: number;
  accent: string;
}

const TOPOLOGY_HOTSPOTS: TopologyNodeHotspot[] = [
  {
    id: 'edge',
    labIndex: 2,
    label: 'Edge Proxy',
    sub: 'TLS 1.3 · 42ms P95',
    x: 110,
    y: 86,
    accent: '#38BDF8',
  },
  {
    id: 'gitops',
    labIndex: 0,
    label: 'Argo GitOps',
    sub: 'Helm v3 · 38s Sync',
    x: 340,
    y: 86,
    accent: '#818CF8',
  },
  {
    id: 'mesh',
    labIndex: 4,
    label: 'eBPF Mesh',
    sub: 'Cilium · 0.4ms Hook',
    x: 225,
    y: 186,
    accent: '#34D399',
  },
  {
    id: 'obs',
    labIndex: 1,
    label: 'Telemetry Stack',
    sub: 'Prom + Loki · 15s',
    x: 110,
    y: 286,
    accent: '#818CF8',
  },
  {
    id: 'iac',
    labIndex: 3,
    label: 'Terraform IaC',
    sub: 'OIDC · 0 Static Keys',
    x: 340,
    y: 286,
    accent: '#38BDF8',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onInspectLab }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('mesh');
  const activeHotspot =
    TOPOLOGY_HOTSPOTS.find((n) => n.id === activeNodeId) ?? TOPOLOGY_HOTSPOTS[2];
  const linkedLab = LAB_MODULES[activeHotspot.labIndex];

  return (
    <section id="overview" className="relative pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Split-Screen Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Typography & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between py-2"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wide text-sky-300/90 mb-5">
                <span className="text-slate-200 font-semibold">HEIN SITT</span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span>Infrastructure &amp; Cloud Lab Playground</span>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-50 leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                Building Resilient Systems &amp; Interactive Web Craft.
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-[1.0625rem] leading-relaxed text-slate-300/90">
                Cloud and infrastructure engineering sandbox exploring declarative GitOps
                pipelines, container observability, edge reliability, and 60fps interactive
                web instrumentation.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#labs"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D16]"
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                <span>Lab Modules</span>
              </a>

              <a
                href="#journey"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-[#0F172A]/80 px-5 py-3 text-sm font-medium text-slate-200 hover:border-indigo-400/50 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <span>Journey Timeline</span>
                <ArrowDownRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Interactive Control Plane Topology Preview */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="w-full rounded-2xl border border-slate-800/90 bg-[#0F172A]/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-3.5">
                <div>
                  <p className="text-xs font-mono text-slate-400">Interactive Topology</p>
                  <h2 className="text-sm font-semibold text-slate-100 mt-0.5">
                    Cluster Mesh &amp; Delivery Matrix
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400 tabular-nums">
                  5 Nodes Active
                </span>
              </div>

              {/* Interactive SVG Mesh */}
              <div className="my-4 relative">
                <svg
                  viewBox="0 0 450 356"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive cloud infrastructure topology mesh"
                >
                  <defs>
                    <radialGradient id="heroMeshGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <circle cx="225" cy="186" r="150" fill="url(#heroMeshGlow)" />

                  {/* Connecting Mesh Edges */}
                  {[
                    { x1: 110, y1: 86, x2: 340, y2: 86 },
                    { x1: 110, y1: 86, x2: 225, y2: 186 },
                    { x1: 340, y1: 86, x2: 225, y2: 186 },
                    { x1: 225, y1: 186, x2: 110, y2: 286 },
                    { x1: 225, y1: 186, x2: 340, y2: 286 },
                    { x1: 110, y1: 286, x2: 340, y2: 286 },
                    { x1: 110, y1: 86, x2: 110, y2: 286 },
                    { x1: 340, y1: 86, x2: 340, y2: 286 },
                  ].map((edge, idx) => (
                    <g key={idx}>
                      <line
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke="rgba(148, 163, 184, 0.16)"
                        strokeWidth="1.2"
                      />
                      <line
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke={idx % 2 === 0 ? 'rgba(56, 189, 248, 0.55)' : 'rgba(129, 140, 248, 0.5)'}
                        strokeWidth="1.5"
                        className="animate-flow-dash"
                      />
                    </g>
                  ))}

                  {/* Interactive Hotspot Nodes */}
                  {TOPOLOGY_HOTSPOTS.map((node) => {
                    const isActive = node.id === activeNodeId;
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        onMouseEnter={() => setActiveNodeId(node.id)}
                        onClick={() => {
                          setActiveNodeId(node.id);
                          onInspectLab(LAB_MODULES[node.labIndex]);
                        }}
                        className="cursor-pointer group"
                        role="button"
                        tabIndex={0}
                        aria-label={`Inspect ${node.label} architecture`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveNodeId(node.id);
                            onInspectLab(LAB_MODULES[node.labIndex]);
                          }
                        }}
                      >
                        {isActive && (
                          <circle
                            r="38"
                            fill="none"
                            stroke={node.accent}
                            strokeOpacity="0.35"
                            strokeWidth="1.5"
                          />
                        )}
                        <rect
                          x="-66"
                          y="-26"
                          width="132"
                          height="52"
                          rx="10"
                          fill={isActive ? '#17233A' : '#111827'}
                          stroke={isActive ? node.accent : 'rgba(148, 163, 184, 0.25)'}
                          strokeWidth={isActive ? '1.6' : '1'}
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fill="#F8FAFC"
                          fontSize="12"
                          fontWeight="600"
                          fontFamily="Outfit, sans-serif"
                        >
                          {node.label}
                        </text>
                        <text
                          x="0"
                          y="13"
                          textAnchor="middle"
                          fill={isActive ? node.accent : '#94A3B8'}
                          fontSize="10"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {node.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Selected Node Quick Inspector Footer */}
              <div className="border-t border-slate-800/80 pt-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-slate-400 truncate">
                    {linkedLab.id} · {linkedLab.category}
                  </p>
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {linkedLab.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onInspectLab(linkedLab)}
                  className="rounded-md border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs font-medium text-sky-300 hover:border-sky-400/50 hover:text-sky-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  Open Diagram
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Engineering Strip Below Split */}
        <div className="mt-14 border-y border-slate-800/80 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3">
            <Layers className="h-4 w-4 text-sky-400 mt-1 shrink-0" aria-hidden="true" />
            <div>
              <div className="font-mono text-xl font-semibold text-slate-50 tabular-nums">
                06 Labs
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Interactive Blueprints &amp; Diagrams
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GitBranch className="h-4 w-4 text-indigo-400 mt-1 shrink-0" aria-hidden="true" />
            <div>
              <div className="font-mono text-xl font-semibold text-slate-50 tabular-nums">
                GitOps
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Declarative Pull Reconciliation
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 text-emerald-400 mt-1 shrink-0" aria-hidden="true" />
            <div>
              <div className="font-mono text-xl font-semibold text-slate-50 tabular-nums">
                15s / 0.4ms
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Metric Scrape &amp; eBPF Kernel Probes
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 text-sky-400 mt-1 shrink-0" aria-hidden="true" />
            <div>
              <div className="font-mono text-xl font-semibold text-slate-50 tabular-nums">
                60 fps
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                GPU-Composited Pointer Physics
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
