'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, X, Tag, Box, FileText, Info, AlertCircle, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function WorkerCatalogPage() {
  const { products } = useAppStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [selected, setSelected] = useState<typeof products[0] | null>(null);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))), [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, catFilter]);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>Product Catalog</h1>

      {/* Search */}
      <div className="search-wrapper" style={{ marginBottom: 14 }}>
        <Search size={16} />
        <input className="input-field" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 42, fontSize: 15, padding: '12px 14px 12px 42px' }} />
      </div>

      {/* Category Scroll */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        <button onClick={() => setCatFilter('')} className={!catFilter ? 'btn-primary' : 'btn-secondary'} style={{ padding: '6px 14px', fontSize: 12, flexShrink: 0 }}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={catFilter === c ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', fontSize: 12, flexShrink: 0 }}>{c}</button>
        ))}
      </div>

      {/* Product List */}
      {filtered.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
          onClick={() => setSelected(p)} className="glass-card"
          style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Package size={22} color="var(--accent-hover)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.code} · ${p.price?.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span className="badge badge-success" style={{ fontSize: 10 }}>{p.status}</span>
          </div>
        </motion.div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Package size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--text-muted)' }}>No products found</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 480, maxHeight: '85vh', overflowY: 'auto', padding: 28, border: '1px solid var(--surface-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={22} color="var(--accent-hover)" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800 }}>{selected.name}</h2>
                    <code style={{ fontSize: 12, color: 'var(--accent-hover)' }}>{selected.code}</code>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={22} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Category', val: selected.category },
                  { label: 'Price', val: `$${selected.price?.toFixed(2)}` },
                  ...(selected.tags ? [{ label: 'Tags', val: selected.tags.join(', ') }] : [])
                ].map(d => (
                  <div key={d.label} style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{d.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{d.val}</div>
                  </div>
                ))}
              </div>

              {selected.specifications && Object.keys(selected.specifications).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {Object.entries(selected.specifications).map(([k, v]) => (
                    <div key={k} style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ padding: 14, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Stock Quantity</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{selected.stock}</div>
              </div>

              {selected.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{selected.description}</p>}

              {selected.instructions && (
                <div style={{ padding: 14, background: 'var(--info-subtle)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--info)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Info size={13} /> Instructions</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selected.instructions}</div>
                </div>
              )}
              {selected.notes && (
                <div style={{ padding: 14, background: 'var(--warning-subtle)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><AlertCircle size={13} /> Notes</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selected.notes}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
