import React from 'react';
import { ArrowUp, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className="border-t border-slate-800/80 bg-[#090D16] py-10"
    >
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="font-display text-base font-bold tracking-tight text-slate-100">
            HEINSITT.LAB
          </div>
          <p className="text-xs text-slate-400">
            Hein Sitt · Cloud Infrastructure, GitOps &amp; Interactive Web Systems
          </p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400"
        >
          <a
            href="#overview"
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#labs"
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Lab Modules
          </a>
          <a
            href="#journey"
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Journey Timeline
          </a>
        </nav>

        <div className="flex flex-wrap items-center gap-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Lab Environment: Active</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#0F172A] px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-sky-400/50 hover:text-white transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
