'use client';
import { motion } from 'framer-motion';
import { Package, Scan, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Clock, BarChart3, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function AdminDashboard() {
  const { products, activityLogs, recognitionLogs } = useAppStore();

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, change: '+3 this week', up: true, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Total Scans', value: recognitionLogs.length * 47, icon: Scan, change: '+12% vs last week', up: true, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Recognition Rate', value: '94.7%', icon: TrendingUp, change: '+2.1% improvement', up: true, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Active Workers', value: 3, icon: Users, change: '2 online now', up: true, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  ];

  const topProducts = products.slice(0, 5).map((p, i) => ({ ...p, scans: [284, 231, 198, 176, 152][i] }));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <h1 className="page-title">Dashboard</h1>
          <span className="badge badge-success" style={{ fontSize: 11 }}>Live</span>
        </div>
        <p className="page-subtitle">Welcome back, Tushar. Here&apos;s your system overview.</p>
      </div>

      {/* Stats Grid */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="responsive-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: s.up ? 'var(--success)' : 'var(--danger)' }}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.change}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="responsive-grid-2-1" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        {/* Scan Activity Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Scan Activity</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 12 days</p>
            </div>
            <div className="badge badge-accent"><BarChart3 size={12} /> Analytics</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
            {[42, 38, 65, 52, 78, 61, 85, 54, 92, 70, 48, 88].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ flex: 1, background: i === 11 ? 'var(--gradient-brand)' : 'rgba(99,102,241,0.15)', borderRadius: '4px 4px 0 0', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                whileHover={{ background: 'rgba(99,102,241,0.4)' }}>
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }}
                  className="bar-label">{h}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].map((d) => (
              <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>May {d}</span>
            ))}
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24 }}>By Category</h3>
          {[
            { name: 'Beverages', count: 8, pct: 50, color: '#6366f1' },
            { name: 'Home Care', count: 4, pct: 25, color: '#22c55e' },
            { name: 'Personal Care', count: 2, pct: 12.5, color: '#f59e0b' },
            { name: 'Food & Pantry', count: 1, pct: 6.25, color: '#ef4444' },
          ].map((c) => (
            <div key={c.name} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.count} products</span>
              </div>
              <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 1, delay: 0.6 }}
                  style={{ height: '100%', borderRadius: 'var(--radius-full)', background: c.color }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="responsive-grid-1-1" style={{ display: 'grid', gap: 16 }}>
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Top Scanned Products</h3>
            <span className="badge badge-info" style={{ fontSize: 11 }}>This week</span>
          </div>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--surface-border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.code} · {p.category}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-hover)' }}>{p.scans}</div>
            </div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
            <Activity size={16} color="var(--text-muted)" />
          </div>
          {activityLogs.slice(0, 6).map((log) => {
            const typeColors: Record<string, string> = { scan: '#6366f1', view: '#3b82f6', edit: '#f59e0b', create: '#22c55e', delete: '#ef4444', login: '#a78bfa' };
            return (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--surface-border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[log.type] || '#6366f1', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{log.userName}</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>{' '}
                    <span style={{ fontWeight: 500, color: 'var(--accent-hover)' }}>{log.target}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {new Date(log.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
