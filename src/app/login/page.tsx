'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

// ─── Admin Credentials ────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@anticbuddy.com';
const ADMIN_PASSWORD = 'anticbuddy@123';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({ id: 'U-001', name: 'Tushar Makwana', role: 'admin', avatar: 'T', email });
      router.push('/admin');
    } else {
      setError('Invalid email or password. Check your credentials and try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      {/* Left Panel */}
      <div className="login-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px clamp(20px, 5vw, 80px)', position: 'relative', zIndex: 1, maxWidth: 560 }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>A</div>
            <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>AnticBuddy</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Shield size={24} color="var(--accent-hover)" />
            <h1 style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Admin Sign In
            </h1>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Secure access to the AnticBuddy Product Management System.
          </p>



          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 13, color: 'var(--danger)' }}>
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin}>
            <div className="float-label" style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input className="input-field" type="email" placeholder="Enter your email" required
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="float-label" style={{ marginBottom: 28 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                  value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" className="btn-primary" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{ width: '100%', padding: '14px 24px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Authenticating...
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    Sign In to Admin Panel <ArrowRight size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            Worker? Go to{' '}
            <a href="/worker" style={{ color: 'var(--accent-hover)', fontWeight: 600, textDecoration: 'none' }}>Worker Panel →</a>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <motion.div className="login-right" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '100vh' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 180, height: 180, borderRadius: 'var(--radius-xl)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 60px rgba(99,102,241,0.3)' }}>
            <Zap size={72} color="white" strokeWidth={1.5} />
          </motion.div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>Product Intelligence</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>
            AI-powered recognition, real-time analytics, and enterprise-grade product management.
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-right { display: none !important; }
          .login-left { max-width: 100% !important; padding: 30px 20px !important; }
        }
      `}</style>
    </div>
  );
}
