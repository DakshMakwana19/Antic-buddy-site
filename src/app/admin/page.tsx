'use client';
import { motion } from 'framer-motion';
import { Package, Scan, TrendingUp, Users, Clock, BarChart3, Activity, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function AdminDashboard() {
  const { products, activityLogs, recognitionLogs, user } = useAppStore();

  const totalProducts = products.length;
  const totalScans = recognitionLogs.length;
  const matchedScans = recognitionLogs.filter(r => r.matched).length;
  const recognitionRate = totalScans > 0 ? ((matchedScans / totalScans) * 100).toFixed(1) + '%' : '—';

  // Category breakdown from real products
  const catCounts: Record<string, number> = {};
  products.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
  const catList = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
  const catColors: Record<string, string> = { 'Beverages': '#6366f1', 'Home Care': '#22c55e', 'Personal Care': '#f59e0b', 'Food & Pantry': '#ef4444' };

  const stats = [
    { label: 'Total Products', value: totalProducts, icon: Package, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Total Scans', value: totalScans, icon: Scan, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Recognition Rate', value: recognitionRate, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Activity Logs', value: activityLogs.length, icon: Activity, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  ];

  const isEmpty = totalProducts === 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <h1 className="page-title">Dashboard</h1>
          <span className="badge badge-success" style={{ fontSize: 11 }}>Live</span>
        </div>
        <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}. Here&apos;s your system overview.</p>
      </div>

      {/* Empty State — show when no products yet */}
      {isEmpty && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ padding: '40px 24px', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Package size={30} color="var(--accent-hover)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products yet</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
            Start by adding your first product to the system. All stats and charts will populate automatically.
          </p>
          <Link href="/admin/upload" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <Plus size={16} /> Add First Product
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="responsive-stats-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="responsive-grid-2-1" style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
        {/* Recent Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Recent Products</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest added to system</p>
            </div>
            <Link href="/admin/products" className="badge badge-accent" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <BarChart3 size={12} /> View All
            </Link>
          </div>
          {products.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No products added yet.
            </div>
          ) : (
            products.slice(0, 6).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < Math.min(products.length, 6) - 1 ? '1px solid var(--surface-border)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: 'var(--accent-subtle)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={14} color="var(--accent-hover)" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.code} · {p.category}</div>
                </div>
                <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>{p.status}</span>
              </div>
            ))
          )}
        </motion.div>

        {/* Category Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>By Category</h3>
          {catList.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No data yet.</div>
          ) : (
            catList.map(([name, count]) => {
              const pct = totalProducts > 0 ? (count / totalProducts) * 100 : 0;
              const color = catColors[name] || '#6366f1';
              return (
                <div key={name} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} products</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.6 }}
                      style={{ height: '100%', borderRadius: 'var(--radius-full)', background: color }} />
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
          <Activity size={16} color="var(--text-muted)" />
        </div>
        {activityLogs.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No activity yet. Actions will appear here.</div>
        ) : (
          activityLogs.slice(0, 6).map((log, i) => {
            const typeColors: Record<string, string> = { scan: '#6366f1', view: '#3b82f6', edit: '#f59e0b', create: '#22c55e', delete: '#ef4444', login: '#a78bfa' };
            return (
              <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < Math.min(activityLogs.length, 6) - 1 ? '1px solid var(--surface-border)' : 'none' }}>
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
          })
        )}
      </motion.div>
    </div>
  );
}
