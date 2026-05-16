'use client';
import { motion } from 'framer-motion';
import { Activity, Scan, Eye, Edit2, Plus, Trash2, LogIn, Clock, Filter } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

const typeIcons: Record<string, React.ElementType> = { scan: Scan, view: Eye, edit: Edit2, create: Plus, delete: Trash2, login: LogIn };
const typeColors: Record<string, string> = { scan: '#6366f1', view: '#3b82f6', edit: '#f59e0b', create: '#22c55e', delete: '#ef4444', login: '#a78bfa' };

export default function ActivityPage() {
  const { activityLogs } = useAppStore();
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = typeFilter ? activityLogs.filter(l => l.type === typeFilter) : activityLogs;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>Activity Logs</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Track all system activity and worker actions.</p>
        </div>
        <Activity size={24} color="var(--text-muted)" />
      </div>

      {/* Type Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button onClick={() => setTypeFilter('')} className={!typeFilter ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: 12 }}>All</button>
        {['scan', 'view', 'edit', 'create', 'delete', 'login'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={typeFilter === t ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: 12, textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        {filtered.map((log, i) => {
          const Icon = typeIcons[log.type] || Activity;
          const color = typeColors[log.type] || '#6366f1';
          return (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--surface-border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>
                  <span style={{ fontWeight: 600 }}>{log.userName}</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{log.action}</span>{' '}
                  <span style={{ fontWeight: 600, color: 'var(--accent-hover)' }}>{log.target}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <span className={`badge`} style={{ background: `${color}15`, color, fontSize: 11, textTransform: 'capitalize' }}>{log.type}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
