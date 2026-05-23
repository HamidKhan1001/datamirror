"use client";

import { CollectionEngine } from "../components/collection/CollectionEngine";

export default function HomePage() {
  return (
    <main className="min-h-screen matrix-backdrop">
      {/* Header */}
      <header className="border-b border-[rgba(0,255,136,0.1)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
          <span className="font-mono text-sm font-bold tracking-widest text-[var(--neon-green)] uppercase">
            DataMirror
          </span>
          <span className="font-mono text-[10px] text-gray-600 border border-gray-700 px-1.5 py-0.5 rounded">
            v1.0
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="/admin"
            className="font-mono text-xs text-gray-500 hover:text-[var(--neon-green)] transition-colors uppercase tracking-wider"
          >
            Admin Panel
          </a>
        </nav>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <CollectionEngine />
      </div>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,255,136,0.08)] px-6 py-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-600">
          <span>DataMirror — Browser fingerprinting, session tracking & behavioral analytics showcase</span>
          <span className="text-[var(--neon-green)] opacity-50">
            TRACKING: Device • IP • Sessions • Behavior • Heatmaps • Keyboard Dynamics • Canvas • WebGL
          </span>
        </div>
      </footer>
    </main>
  );
}
