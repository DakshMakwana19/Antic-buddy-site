'use client';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Scan, Package, Users, Clock, Target, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AnalyticsPage() {
  const { products, recognitionLogs, activityLogs } = useAppStore();

  const weeklyData = [
    { day: 'Mon', scans: 42, matches: 39 },
    { day: 'Tue', scans: 58, matches: 54 },
    { day: 'Wed', scans: 65, matches: 62 },
    { day: 'Thu', scans: 72, matches: 68 },
    { day: 'Fri', scans: 88, matches: 82 },
    { day: 'Sat', scans: 35, matches: 33 },
    { day: 'Sun', scans: 22, matches: 21 },
  ];
  const maxScans = Math.max(...weeklyData.map(d => d.scans));

  const hourlyData = [2, 5, 3, 1, 0, 0, 2, 12, 28, 35, 42, 38, 30, 45, 40, 36, 48, 52, 28, 15, 8, 5, 3, 1];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Analytics</h1>
        <p className="page-subtitle">Performance metrics and operational insights.</p>
      </div>

      {/* KPI Row */}
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="responsive-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Avg. Scans / Day', value: '54', icon: Scan, color: '#6366f1', sub: '↑ 8% vs last week' },
          { label: 'Recognition Accuracy', value: '94.7%', icon: Target, color: '#22c55e', sub: '↑ 2.1% improvement' },
          { label: 'Avg. Response Time', value: '1.8s', icon: Zap, color: '#f59e0b', sub: '↓ 0.3s faster' },
          { label: 'Unique Products Scanned', value: '14', icon: Package, color: '#3b82f6', sub: 'of 16 total' },
        ].map((kpi) => (
          <motion.div key={kpi.label} variants={fadeUp} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={18} color={kpi.color} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 500 }}>{kpi.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="responsive-grid-1-1" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        {/* Weekly Scans */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Weekly Scan Performance</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Scans vs Successful Matches</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
            {weeklyData.map((d, i) => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 180 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.scans / maxScans) * 100}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                    style={{ flex: 1, background: 'rgba(99,102,241,0.25)', borderRadius: '3px 3px 0 0' }} />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.matches / maxScans) * 100}%` }} transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
                    style={{ flex: 1, background: 'var(--gradient-brand)', borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(99,102,241,0.25)' }} /> Total Scans
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }} /> Matched
            </div>
          </div>
        </motion.div>

        {/* Hourly Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Hourly Activity</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Scan distribution across 24 hours</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
            {hourlyData.map((h, i) => {
              const maxH = Math.max(...hourlyData);
              return (
                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(h / maxH) * 100}%` }} transition={{ duration: 0.6, delay: 0.5 + i * 0.02 }}
                  style={{ flex: 1, background: h > 30 ? '#6366f1' : h > 15 ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.2)', borderRadius: '2px 2px 0 0', minHeight: h > 0 ? 2 : 0 }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>12 AM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>6 AM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>12 PM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>6 PM</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>11 PM</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="responsive-grid-1-1" style={{ display: 'grid', gap: 16 }}>
        {/* Top Categories */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Product Category Performance</h3>
          {[
            { name: 'Beverages', scans: 168, pct: 45, products: 8, color: '#6366f1' },
            { name: 'Home Care', scans: 95, pct: 26, products: 4, color: '#22c55e' },
            { name: 'Personal Care', scans: 72, pct: 19, products: 2, color: '#f59e0b' },
            { name: 'Food & Pantry', scans: 37, pct: 10, products: 1, color: '#ef4444' },
          ].map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--surface-border)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{c.name}</div>
                <div style={{ height: 4, borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: 0.6 }}
                    style={{ height: '100%', borderRadius: 'var(--radius-full)', background: c.color }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{c.scans}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>scans</div>
              </div>
            </div>
          ))}
        </div>

        {/* Worker Performance */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Worker Performance</h3>
          {[
            { name: 'Ravi Kumar', scans: 128, accuracy: 96, avatar: 'R' },
            { name: 'Priya Sharma', scans: 105, accuracy: 93, avatar: 'P' },
            { name: 'Amit Patel', scans: 89, accuracy: 91, avatar: 'A' },
          ].map((w, i) => (
            <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 2 ? '1px solid var(--surface-border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', flexShrink: 0 }}>{w.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{w.scans} scans this week</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: w.accuracy >= 95 ? 'var(--success)' : w.accuracy >= 90 ? 'var(--warning)' : 'var(--danger)' }}>{w.accuracy}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>accuracy</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
