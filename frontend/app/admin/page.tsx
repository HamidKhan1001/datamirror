"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchAdminStats, fetchAdminScans } from "../../lib/api-client";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { GlowCard } from "../../components/ui/GlowCard";

interface ScanRecord {
  id: string;
  created_at: string;
  fingerprint_hash: string;
  browser_tier: string;
  device_class: string;
  network_class: string;
  timezone_region: string;
  language_group: string;
  uniqueness_score: number;
  cpm_value: number;
  confidence_tier: string;
  raw_data: Record<string, any>;
  ai_analysis: Record<string, any>;
}

interface AdminStats {
  total_scans: number;
  avg_uniqueness: number;
  avg_cpm: number;
  device_breakdown: Record<string, number>;
  network_breakdown: Record<string, number>;
  confidence_breakdown: Record<string, number>;
  browser_breakdown: Record<string, number>;
  timezone_breakdown: Record<string, number>;
}

function BreakdownBar({ label, value, total, color = "var(--neon-green)" }: { label: string; value: number; total: number; color?: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[11px]">
        <span className="text-gray-400 truncate max-w-[140px]">{label}</span>
        <span className="text-white font-semibold">{value} <span className="text-gray-500">({pct}%)</span></span>
      </div>
      <div className="h-1.5 w-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    "Highly Identifiable": "text-[var(--electric-red)] border-red-500/40 bg-red-950/20",
    "Trackable": "text-cyan-400 border-cyan-400/40 bg-cyan-950/20",
    "Anonymous": "text-[var(--neon-green)] border-green-500/40 bg-green-950/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded border font-mono text-[10px] uppercase font-bold ${colors[tier] ?? "text-gray-400 border-gray-600"}`}>
      {tier}
    </span>
  );
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<"locked" | "authenticated" | "error">("locked");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [totalScans, setTotalScans] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [storedKey, setStoredKey] = useState<string | null>(null);

  // Pull stored key on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = sessionStorage.getItem("dm_admin_key");
      if (key) {
        setStoredKey(key);
        setPasscode(key);
      }
    }
  }, []);

  const loadData = useCallback(async (key: string, pg: number) => {
    setLoading(true);
    try {
      const [statsData, scansData] = await Promise.all([
        fetchAdminStats(key),
        fetchAdminScans(key, pg),
      ]);
      setStats(statsData);
      setScans(scansData.scans ?? []);
      setTotalScans(scansData.total_scans ?? 0);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-login if stored key present
  useEffect(() => {
    if (storedKey && authState === "locked") {
      setAuthState("authenticated");
      loadData(storedKey, 1);
    }
  }, [storedKey, authState, loadData]);

  const handleLogin = async () => {
    setAuthError("");
    setLoading(true);
    try {
      await fetchAdminStats(passcode);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dm_admin_key", passcode);
      }
      setStoredKey(passcode);
      setAuthState("authenticated");
      loadData(passcode, 1);
    } catch (e: any) {
      setAuthError(e.message || "Invalid credentials.");
      setAuthState("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (storedKey) loadData(storedKey, newPage);
  };

  const totalPages = Math.ceil(totalScans / 15);

  // ---- LOCKED STATE ----
  if (authState !== "authenticated") {
    return (
      <main className="min-h-screen matrix-backdrop flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm terminal-panel rounded-lg p-8 space-y-6 font-mono">
          <div className="text-center space-y-2">
            <div className="w-3 h-3 rounded-full bg-[var(--neon-green)] animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.8)] mx-auto" />
            <h1 className="text-lg font-bold text-[var(--neon-green)] glow-green uppercase tracking-widest">
              DataMirror Admin
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">// Restricted Access Terminal</p>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500">
              Enter Admin Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setAuthError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="w-full bg-[#050508] border border-[rgba(0,255,136,0.2)] rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[var(--neon-green)] transition-colors"
            />
            {authError && (
              <p className="text-[var(--electric-red)] text-xs glow-red">{authError}</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !passcode}
            className="w-full py-2.5 border border-[var(--neon-green)] bg-[var(--neon-green)] text-[#050508] font-bold uppercase text-xs tracking-wider hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Authenticate"}
          </button>

          <a href="/" className="block text-center text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
            ← Return to Scanner
          </a>
        </div>
      </main>
    );
  }

  // ---- AUTHENTICATED STATE ----
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
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => loadData(storedKey!, page)}
            className="font-mono text-[10px] text-gray-500 hover:text-[var(--neon-green)] transition-colors uppercase"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("dm_admin_key");
              setAuthState("locked");
              setStoredKey(null);
              setPasscode("");
            }}
            className="font-mono text-[10px] text-gray-500 hover:text-[var(--electric-red)] transition-colors uppercase"
          >
            Log Out
          </button>
          <a href="/" className="font-mono text-[10px] text-gray-500 hover:text-gray-300 transition-colors uppercase">
            ← Scanner
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-mono font-bold text-white">
            // ADMIN <span className="text-[var(--neon-green)] glow-green">SURVEILLANCE</span> CONSOLE
          </h1>
          <p className="text-sm text-gray-500 font-mono mt-1">
            All stored visitor fingerprint records and AI-generated profiles from Neon Postgres.
          </p>
        </div>

        {loading && !stats && (
          <div className="text-center font-mono text-[var(--neon-green)] animate-pulse py-10">
            // QUERYING NEON POSTGRES DATABASE...
          </div>
        )}

        {stats && (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Scans", value: stats.total_scans, suffix: "", decimals: 0 },
                { label: "Avg Uniqueness", value: stats.avg_uniqueness, suffix: "%", decimals: 1 },
                { label: "Avg CPM Value", value: stats.avg_cpm, suffix: "", prefix: "$", decimals: 2 },
                { label: "Device Types", value: Object.keys(stats.device_breakdown).length, suffix: " classes", decimals: 0 },
              ].map(({ label, value, suffix, prefix, decimals }) => (
                <GlowCard key={label} className="text-center select-none py-6">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">{label}</div>
                  <div className="text-4xl font-black text-white font-mono">
                    {prefix ?? ""}
                    {decimals === 0
                      ? <AnimatedCounter value={Math.round(value)} />
                      : value.toFixed(decimals)
                    }
                    <span className="text-sm text-gray-400 font-normal">{suffix}</span>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Breakdown Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Class */}
              <GlowCard className="space-y-4">
                <div className="font-mono text-xs text-[var(--neon-green)] uppercase font-semibold border-b border-[rgba(0,255,136,0.1)] pb-2">
                  // Device Class Breakdown
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.device_breakdown).map(([k, v]) => (
                    <BreakdownBar key={k} label={k} value={v} total={stats.total_scans} />
                  ))}
                  {Object.keys(stats.device_breakdown).length === 0 && (
                    <p className="font-mono text-xs text-gray-600">No data yet.</p>
                  )}
                </div>
              </GlowCard>

              {/* Identity Tier */}
              <GlowCard className="space-y-4">
                <div className="font-mono text-xs text-[var(--neon-green)] uppercase font-semibold border-b border-[rgba(0,255,136,0.1)] pb-2">
                  // Identity Tier Distribution
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.confidence_breakdown).map(([k, v]) => (
                    <BreakdownBar
                      key={k}
                      label={k}
                      value={v}
                      total={stats.total_scans}
                      color={k === "Highly Identifiable" ? "var(--electric-red)" : k === "Anonymous" ? "var(--neon-green)" : "#22d3ee"}
                    />
                  ))}
                  {Object.keys(stats.confidence_breakdown).length === 0 && (
                    <p className="font-mono text-xs text-gray-600">No data yet.</p>
                  )}
                </div>
              </GlowCard>

              {/* Top Timezones */}
              <GlowCard className="space-y-4">
                <div className="font-mono text-xs text-[var(--neon-green)] uppercase font-semibold border-b border-[rgba(0,255,136,0.1)] pb-2">
                  // Top Timezone Regions
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.timezone_breakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([k, v]) => (
                      <BreakdownBar key={k} label={k} value={v} total={stats.total_scans} color="#a78bfa" />
                    ))}
                  {Object.keys(stats.timezone_breakdown).length === 0 && (
                    <p className="font-mono text-xs text-gray-600">No data yet.</p>
                  )}
                </div>
              </GlowCard>
            </div>

            {/* Scans Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.1)] pb-3">
                <h2 className="font-mono text-lg font-bold text-white">
                  // STORED VISITOR <span className="text-[var(--neon-green)] glow-green">SCAN RECORDS</span>
                </h2>
                <span className="font-mono text-[10px] text-gray-500">
                  {totalScans} records · Page {page}/{Math.max(1, totalPages)}
                </span>
              </div>

              {scans.length === 0 ? (
                <div className="terminal-panel rounded-lg p-12 text-center font-mono text-gray-600">
                  // NO SCAN RECORDS IN DATABASE. RUN A BROWSER SCAN FIRST.
                </div>
              ) : (
                <div className="terminal-panel rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-xs">
                      <thead>
                        <tr className="border-b border-[rgba(0,255,136,0.1)] bg-[rgba(0,255,136,0.02)]">
                          {["Timestamp", "Hash (8ch)", "Device", "Network", "Score", "CPM", "Identity Tier", "Region", ""].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[9px] uppercase tracking-widest text-gray-500 font-semibold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {scans.map((scan, idx) => (
                          <tr
                            key={scan.id}
                            className={`border-b border-[rgba(0,255,136,0.05)] hover:bg-[rgba(0,255,136,0.03)] transition-colors ${idx % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.01)]"}`}
                          >
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                              {new Date(scan.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-[var(--neon-green)] font-semibold whitespace-nowrap">
                              {scan.fingerprint_hash.substring(0, 8)}...
                            </td>
                            <td className="px-4 py-3 text-gray-300 capitalize">{scan.device_class}</td>
                            <td className="px-4 py-3 text-gray-300 capitalize">{scan.network_class}</td>
                            <td className="px-4 py-3 text-white font-bold">{scan.uniqueness_score}%</td>
                            <td className="px-4 py-3 text-white font-bold">${scan.cpm_value.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <TierBadge tier={scan.confidence_tier} />
                            </td>
                            <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate">{scan.timezone_region}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => setSelectedScan(scan)}
                                className="text-[9px] uppercase border border-[rgba(0,255,136,0.3)] text-[var(--neon-green)] px-2 py-1 hover:bg-[rgba(0,255,136,0.08)] transition-colors whitespace-nowrap cursor-pointer"
                              >
                                View →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="font-mono text-xs px-3 py-1.5 border border-[rgba(0,255,136,0.2)] text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="font-mono text-xs text-gray-500 px-3 py-1.5">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="font-mono text-xs px-3 py-1.5 border border-[rgba(0,255,136,0.2)] text-gray-400 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedScan && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-start justify-end"
          onClick={() => setSelectedScan(null)}
        >
          <div
            className="w-full max-w-xl h-screen overflow-y-auto terminal-panel border-l border-[rgba(0,255,136,0.2)] p-6 space-y-6 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[rgba(0,255,136,0.15)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--neon-green)] glow-green uppercase">
                  Scan Detail Record
                </h3>
                <p className="text-[9px] text-gray-500 mt-0.5">{selectedScan.id}</p>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="text-gray-500 hover:text-white text-base transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Core fields */}
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">// Core Metadata</div>
              {[
                ["Fingerprint Hash", selectedScan.fingerprint_hash],
                ["Scanned At", new Date(selectedScan.created_at).toLocaleString()],
                ["Browser Tier", selectedScan.browser_tier],
                ["Device Class", selectedScan.device_class],
                ["Network Class", selectedScan.network_class],
                ["Timezone Region", selectedScan.timezone_region],
                ["Language Group", selectedScan.language_group],
                ["Uniqueness Score", `${selectedScan.uniqueness_score}%`],
                ["CPM Valuation", `$${selectedScan.cpm_value.toFixed(2)}`],
                ["Identity Tier", selectedScan.confidence_tier],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start gap-4 bg-[#030305] p-2 rounded border border-[rgba(0,255,136,0.05)]">
                  <span className="text-gray-500 whitespace-nowrap">{k}:</span>
                  <span className="text-white text-right break-all select-all">{v}</span>
                </div>
              ))}
            </div>

            {/* Raw Data */}
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">// Raw Sensor Data</div>
              <pre className="bg-[#030305] border border-[rgba(0,255,136,0.08)] rounded p-3 text-[10px] text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(selectedScan.raw_data, null, 2)}
              </pre>
            </div>

            {/* AI Analysis */}
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">// AI Analysis Result</div>
              <pre className="bg-[#030305] border border-[rgba(0,255,136,0.08)] rounded p-3 text-[10px] text-gray-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {JSON.stringify(selectedScan.ai_analysis, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
