'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Package, X, Upload, Image as ImageIcon, Filter } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';

type EditableProduct = Omit<Product, 'price' | 'stock'> & { price: string | number; stock: string | number };

const emptyProduct = (): EditableProduct => ({
  id: '', name: '', code: '', category: '', tags: [], images: [], image: '',
  price: '', stock: '', specifications: {}, description: '', notes: '', instructions: '',
  isCocreate: false, status: 'active', createdBy: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct, addProduct, user } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<EditableProduct>(emptyProduct());
  const [specs, setSpecs] = useState<{ key: string; val: string }[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Categories from database
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => { if (p.category) cats.add(p.category); });
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = search ? (
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
      ) : true;
      const matchCat = filterCategory === 'All' ? true : p.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, filterCategory]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product permanently?')) deleteProduct(id);
  };

  const openEdit = (product: Product) => {
    setEditProduct({ ...product });
    setTagsInput(product.tags?.join(', ') || '');
    const specArr = Object.entries(product.specifications || {}).map(([k, v]) => ({ key: k, val: v }));
    setSpecs(specArr.length > 0 ? specArr : [{ key: 'Size', val: '' }]);
    setImagePreview(product.image || '');
    setIsEditing(true);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditProduct({ ...emptyProduct(), id: `PRD-${Date.now()}`, createdBy: user?.name || 'Admin' });
    setTagsInput('');
    setSpecs([{ key: 'Bottle Type', val: '' }, { key: 'Size', val: '' }]);
    setImagePreview('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editProduct.name || !editProduct.code) {
      alert('Product Name and Code are required.');
      return;
    }
    
    const specRecord: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim() && s.val.trim()) specRecord[s.key.trim()] = s.val.trim();
    });

    const finalProduct: Product = {
      ...editProduct,
      price: Number(editProduct.price) || 0,
      stock: Number(editProduct.stock) || 0,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      specifications: specRecord,
      image: imagePreview || editProduct.image || '',
      images: [imagePreview || editProduct.image || ''].filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      await updateProduct(finalProduct.id, finalProduct);
    } else {
      await addProduct(finalProduct);
    }
    setShowModal(false);
  };

  const closeModal = () => { setShowModal(false); setImagePreview(''); };

  const Field = ({ label, k, placeholder, type = 'text', list }: { label: string; k: keyof EditableProduct; placeholder?: string; type?: string; list?: string }) => (
    <div className="float-label">
      <label>{label}</label>
      <input
        className="input-field"
        type={type}
        list={list}
        placeholder={placeholder}
        value={String(editProduct[k] ?? '')}
        onChange={e => setEditProduct(prev => ({ ...prev, [k]: type === 'number' ? e.target.value : e.target.value }))}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Products Management</h1>
          <p className="page-subtitle">{products.length} total · {filtered.length} showing</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: '1 1 300px' }}>
          <Search size={16} />
          <input className="input-field" placeholder="Search by name, code, tags or category..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', padding: '0 12px', borderRadius: 'var(--radius-md)' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '10px 0', cursor: 'pointer' }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="data-table" style={{ minWidth: 620 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Category</th>
                <th>Price / Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((p) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                          {p.image
                            ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <Package size={16} color="var(--accent-hover)" />
                          }
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {p.tags && p.tags.length > 0 ? p.tags.slice(0, 2).join(', ') : 'No tags'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-hover)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 4 }}>{p.code}</code></td>
                    <td style={{ fontSize: 13 }}>{p.category || '—'}</td>
                    <td style={{ fontSize: 13 }}>
                      ${p.price?.toFixed(2) || '0.00'} · <strong>{p.stock}</strong> in stock
                    </td>
                    <td><span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'draft' ? 'badge-warning' : 'badge-danger'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewProduct(p)} title="View"
                          style={{ padding: '6px 10px', background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={13} />
                        </button>
                        <button onClick={() => openEdit(p)} title="Edit"
                          style={{ padding: '6px 12px', background: 'var(--accent-subtle)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, cursor: 'pointer', color: 'var(--accent-hover)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Edit2 size={13} /> Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)} title="Delete"
                          style={{ padding: '6px 10px', background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--danger)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Package size={36} color="var(--text-muted)" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{products.length === 0 ? 'No products yet. Click "Add Product" to get started.' : 'No products match your filters.'}</p>
          </div>
        )}
      </div>

      <datalist id="dynamicCategories">
        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
      </datalist>

      {/* ── ADD / EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} style={{ zIndex: 1000, overflowY: 'auto' }}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} style={{ padding: '22px 18px', maxWidth: 800, margin: '40px auto' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>{isEditing ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Product Image</div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }} />
                    <button type="button" onClick={() => { setImagePreview(''); setEditProduct(prev => ({ ...prev, image: '' })); }}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                      <X size={13} />
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'white', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ImageIcon size={11} /> Change
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '18px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-glass)' }}>
                    <Upload size={20} color="var(--text-muted)" style={{ marginBottom: 6 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tap to upload image</p>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="responsive-form-grid" style={{ marginBottom: 12 }}>
                <Field label="Product Name *" k="name" placeholder="e.g. AquaPure 500ml" />
                <Field label="Product Code *" k="code" placeholder="e.g. APC-500" />
                <Field label="Category" k="category" list="dynamicCategories" placeholder="Custom category" />
                <Field label="Price ($)" k="price" type="number" />
                <Field label="Stock Quantity" k="stock" type="number" />
                <div className="float-label">
                  <label>Tags</label>
                  <input className="input-field" placeholder="comma separated" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div style={{ marginBottom: 20, padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Specifications</h4>
                  <button type="button" onClick={() => setSpecs([...specs, { key: '', val: '' }])} style={{ background: 'none', border: 'none', color: 'var(--accent-hover)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
                    <Plus size={14} /> Add Spec
                  </button>
                </div>
                {specs.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <input className="input-field" placeholder="Name (e.g. Weight)" value={s.key} onChange={e => { const n = [...specs]; n[i].key = e.target.value; setSpecs(n); }} style={{ flex: 1 }} />
                    <input className="input-field" placeholder="Value (e.g. 1.2kg)" value={s.val} onChange={e => { const n = [...specs]; n[i].val = e.target.value; setSpecs(n); }} style={{ flex: 2 }} />
                    <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} style={{ background: 'var(--danger-subtle)', border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer', color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="float-label" style={{ marginBottom: 10 }}><label>Description</label><textarea className="input-field" rows={2} value={editProduct.description} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 10 }}><label>Admin Notes</label><textarea className="input-field" rows={2} value={editProduct.notes} onChange={e => setEditProduct(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 14 }}><label>Worker Instructions</label><textarea className="input-field" rows={2} value={editProduct.instructions} onChange={e => setEditProduct(p => ({ ...p, instructions: e.target.value }))} style={{ resize: 'vertical' }} /></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <input type="checkbox" id="cocreate-modal" checked={editProduct.isCocreate} onChange={e => setEditProduct(p => ({ ...p, isCocreate: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                <label htmlFor="cocreate-modal" style={{ fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>Co-Create Product</label>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>{isEditing ? 'Update Product' : 'Save Product'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIEW MODAL ── */}
      <AnimatePresence>
        {viewProduct && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewProduct(null)} style={{ zIndex: 1000, overflowY: 'auto' }}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} style={{ padding: '22px 18px', maxWidth: 800, margin: '40px auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700 }}>{viewProduct.name}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setViewProduct(null); openEdit(viewProduct); }} className="btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}><Edit2 size={13} /> Edit</button>
                  <button onClick={() => setViewProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                </div>
              </div>

              {viewProduct.image && (
                <img src={viewProduct.image} alt={viewProduct.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 18, border: '1px solid var(--surface-border)' }} />
              )}

              <div className="responsive-form-grid" style={{ gap: 12, marginBottom: 14 }}>
                {[
                  ['Code', viewProduct.code], ['Category', viewProduct.category],
                  ['Price', `$${viewProduct.price?.toFixed(2)}`], ['Stock', viewProduct.stock],
                  ['Status', viewProduct.status], ['Co-Create', viewProduct.isCocreate ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{val || '—'}</div>
                  </div>
                ))}
              </div>

              {viewProduct.specifications && Object.keys(viewProduct.specifications).length > 0 && (
                <div style={{ marginBottom: 14, padding: 12, background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--surface-border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Specifications</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                    {Object.entries(viewProduct.specifications).map(([k, v]) => (
                      <div key={k} style={{ fontSize: 13 }}><span style={{ color: 'var(--text-secondary)' }}>{k}:</span> <strong>{v}</strong></div>
                    ))}
                  </div>
                </div>
              )}

              {viewProduct.tags && viewProduct.tags.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {viewProduct.tags.map(t => <span key={t} style={{ fontSize: 11, background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: 12, border: '1px solid var(--surface-border)' }}>{t}</span>)}
                  </div>
                </div>
              )}

              {viewProduct.description && <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Description</div><div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{viewProduct.description}</div></div>}
              {viewProduct.notes && <div style={{ padding: 12, background: 'var(--warning-subtle)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)', marginBottom: 8 }}><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warning)', marginBottom: 4 }}>Admin Notes</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.notes}</div></div>}
              {viewProduct.instructions && <div style={{ padding: 12, background: 'var(--info-subtle)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)' }}><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--info)', marginBottom: 4 }}>Worker Instructions</div><div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.instructions}</div></div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
