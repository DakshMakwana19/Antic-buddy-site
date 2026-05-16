'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Scan, LayoutDashboard, Package, Shield, Zap, BarChart3, Camera, Users, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--surface-border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white' }}>A</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>AnticBuddy</span>
            <span className="brand-subtitle" style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginLeft: 4 }}>by Tushar Makwana</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ padding: '8px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Sign In</Link>
            <Link href="/login" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>Get Started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px 60px' }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: 28, fontSize: 13, fontWeight: 600, color: 'var(--accent-hover)' }}>
            <Zap size={14} /> Enterprise Product Intelligence Platform
          </motion.div>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }} style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24, background: 'linear-gradient(180deg, #fafafa 0%, #a1a1aa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Intelligent Product<br />Recognition &amp; Management
          </motion.h1>

          <motion.p variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Built to simplify operations, train teams faster, and eliminate manual confusion. AI-powered recognition meets enterprise workflow.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              Launch Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/login?role=worker" className="btn-secondary" style={{ padding: '14px 32px', fontSize: 15 }}>
              Worker Access <Camera size={16} />
            </Link>
          </motion.div>

          {/* Trust Bar */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.4 }} style={{ marginTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { val: '16+', label: 'Products Tracked' },
              { val: '97%', label: 'AI Accuracy' },
              { val: '4x', label: 'Faster Training' },
              { val: '24/7', label: 'Always On' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 16px', position: 'relative' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.div variants={fadeUp} style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-hover)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Core Capabilities</motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>Everything You Need</motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>A complete system designed for manufacturing teams who demand precision and speed.</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { icon: Camera, title: 'AI Camera Recognition', desc: 'Point, scan, and instantly identify any product with 97%+ accuracy using computer vision.', color: '#6366f1' },
              { icon: LayoutDashboard, title: 'Admin Dashboard', desc: 'Full control panel to manage products, track activity, and monitor team performance.', color: '#8b5cf6' },
              { icon: Users, title: 'Worker Portal', desc: 'Simplified interface for junior staff — large buttons, camera-first workflow, zero confusion.', color: '#a78bfa' },
              { icon: Package, title: 'Smart Catalog', desc: 'Visual product database with instant search, filters by category, bottle type, and packaging.', color: '#22c55e' },
              { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboards showing scans, recognition rates, product popularity, and team activity.', color: '#f59e0b' },
              { icon: Shield, title: 'Role-Based Access', desc: 'Admins manage everything. Workers view and scan only. Secure, simple, controlled.', color: '#ef4444' },
            ].map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="glass-card" style={{ padding: 28, cursor: 'default' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section style={{ padding: '60px 16px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.div variants={fadeUp} style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-hover)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How It Works</motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Three Steps. Zero Confusion.</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Scan the Product', desc: 'Worker opens the camera and points it at any bottle or package on the floor.' },
              { step: '02', title: 'AI Identifies It', desc: 'Computer vision matches the product against the database in under 2 seconds.' },
              { step: '03', title: 'Get Full Details', desc: 'Product name, code, packaging info, instructions — everything appears instantly.' },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} style={{ position: 'relative', padding: 32 }}>
                <div style={{ fontSize: 64, fontWeight: 900, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.3, position: 'absolute', top: 0, left: 24 }}>{s.step}</div>
                <div style={{ position: 'relative', paddingTop: 48 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ padding: '60px 16px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 600, height: 600, background: '#6366f1', bottom: '-20%', right: '-10%', filter: 'blur(120px)', opacity: 0.1, position: 'absolute' }} />
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} style={{ textAlign: 'center', marginBottom: 48 }}>
            <motion.div variants={fadeUp} style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-hover)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Dashboard Preview</motion.div>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em' }}>Command Center for Managers</motion.h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-card" style={{ padding: '20px', overflow: 'hidden' }}>
            {/* Mock Dashboard Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Products', val: '16', color: '#6366f1' },
                { label: 'Active Scans', val: '284', color: '#22c55e' },
                { label: 'Recognition Rate', val: '94.7%', color: '#f59e0b' },
                { label: 'Workers Online', val: '3', color: '#3b82f6' },
              ].map((c) => (
                <div key={c.label} style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>{c.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.val}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 200, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'flex-end', padding: '0 20px 20px', gap: 8 }}>
              {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 50, 88].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05 }}
                  style={{ flex: 1, background: 'var(--gradient-brand)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ padding: '60px 16px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
            </motion.div>
            <motion.p variants={fadeUp} style={{ fontSize: 20, color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 28 }}>
              &ldquo;This system transformed how our team identifies and handles products. What used to take 10 minutes of explanation now takes 2 seconds.&rdquo;
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>T</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Tushar Makwana</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Founder &amp; Product Lead · AnticBuddy</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 16px', position: 'relative' }}>
        <div className="orb" style={{ width: 500, height: 500, background: '#8b5cf6', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'blur(150px)', opacity: 0.12, position: 'absolute' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>Ready to Transform<br />Your Operations?</motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>Start managing products smarter. Train teams faster. Eliminate confusion forever.</motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/login" className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
                Launch AnticBuddy <ChevronRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 32px', borderTop: '1px solid var(--surface-border)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'white' }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>AnticBuddy</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2026 AnticBuddy by Tushar Makwana. Built with precision.</p>
      </footer>
    </div>
  );
}
