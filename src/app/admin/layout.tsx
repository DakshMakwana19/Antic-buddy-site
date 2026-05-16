'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, Grid3X3, BarChart3, Upload, Activity, Settings, LogOut, Menu, X, Sun, Moon, Camera } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/catalog', label: 'Catalog', icon: Grid3X3 },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/upload', label: 'Add Product', icon: Upload },
  { href: '/admin/recognition', label: 'AI Recognition', icon: Camera },
  { href: '/admin/activity', label: 'Activity Logs', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, theme, toggleTheme, setUser } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  // Auth guard — only check once on mount
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== 'admin') return null;


  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }} data-theme={theme}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 55, backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ padding: '20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white', flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>AnticBuddy</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admin Panel</div>
            </div>
          </div>
          {/* Mobile close button */}
          <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--surface-border)', margin: '12px 8px 16px' }} />

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}>
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <motion.div layoutId="activeTab" style={{ position: 'absolute', left: 0, width: 3, top: 6, bottom: 6, borderRadius: 2, background: 'var(--accent)' }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <button className="sidebar-link" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--surface-border)', margin: '12px 8px' }} />
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white' }}>{user?.avatar || 'A'}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admin</div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="mobile-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--surface-border)',
        zIndex: 50, alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
      }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: 'white' }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>AnticBuddy</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'white' }}>{user?.avatar || 'A'}</div>
      </div>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, marginLeft: 'var(--sidebar-width)', padding: '32px 40px', minHeight: '100vh', overflow: 'auto' }}>
        <div className="page-enter">
          {children}
        </div>
      </main>

      <style jsx>{`
        .sidebar-close-btn { display: none; }
        @media (max-width: 768px) {
          .sidebar-close-btn { display: block; }
          .sidebar {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
}
