'use client';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function RecognitionPage() {
  const { recognitionLogs } = useAppStore();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>AI Recognition History</h1>
        <p className="page-subtitle">All product recognition attempts and results.</p>
      </div>

      {/* Stats */}
      <div className="responsive-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Scans', value: recognitionLogs.length, color: '#6366f1' },
          { label: 'Successful Matches', value: recognitionLogs.filter(r => r.matched).length, color: '#22c55e' },
          { label: 'Avg Confidence', value: `${(recognitionLogs.reduce((a, r) => a + r.confidence, 0) / recognitionLogs.length).toFixed(1)}%`, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="data-table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Worker</th>
              <th>Product</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recognitionLogs.map((log, i) => (
              <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <Clock size={14} color="var(--text-muted)" />
                    {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{log.userName}</td>
                <td>
                  {log.matched ? (
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.productName}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No match found</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="confidence-bar" style={{ width: 80 }}>
                      <div className="confidence-fill" style={{
                        width: `${log.confidence}%`,
                        background: log.confidence > 80 ? 'var(--success)' : log.confidence > 50 ? 'var(--warning)' : 'var(--danger)',
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{log.confidence}%</span>
                  </div>
                </td>
                <td>
                  {log.matched ? (
                    <span className="badge badge-success"><CheckCircle size={12} /> Matched</span>
                  ) : (
                    <span className="badge badge-danger"><XCircle size={12} /> Failed</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
