'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Package, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { categories, bottleTypes, labelTypes, packagingTypes } from '@/lib/data';
import { Product } from '@/types';

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct, addProduct } = useAppStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, catFilter]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      if (editProduct) setEditProduct({ ...editProduct, image: result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) deleteProduct(id);
  };

  const openEdit = (product: Product) => {
    setEditProduct({ ...product });
    setImagePreview(product.image || '');
    setShowModal(true);
  };

  const openAdd = () => {
    setEditProduct({
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`, name: '', code: '',
      category: 'Beverages', subcategory: '', bottleType: 'PET Round',
      labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
      size: '', color: '', quantity: 0, description: '', notes: '', instructions: '',
      isCocreate: false, image: '', status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setImagePreview('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editProduct) return;
    const existing = products.find(p => p.id === editProduct.id);
    const finalProduct = { ...editProduct, image: imagePreview || editProduct.image };
    if (existing) updateProduct(editProduct.id, finalProduct);
    else addProduct(finalProduct);
    setShowModal(false);
    setEditProduct(null);
    setImagePreview('');
  };

  const closeModal = () => { setShowModal(false); setEditProduct(null); setImagePreview(''); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>Products</h1>
          <p className="page-subtitle">{products.length} total · {filtered.length} showing</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, minWidth: 180 }}>
          <Search size={16} />
          <input className="input-field" placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
        <select className="select-field" style={{ minWidth: 140, flex: '0 1 160px' }} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Category</th>
                <th>Size</th>
                <th>Qty</th>
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
                        {/* Product thumbnail */}
                        <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                          {p.image ? (
                            <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Package size={16} color="var(--accent-hover)" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.bottleType}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-hover)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 4 }}>{p.code}</code></td>
                    <td>{p.category}</td>
                    <td>{p.size}</td>
                    <td style={{ fontWeight: 600 }}>{p.quantity.toLocaleString()}</td>
                    <td><span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'draft' ? 'badge-warning' : 'badge-danger'}`}>{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewProduct(p)} style={{ padding: 6, background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)' }}><Eye size={14} /></button>
                        <button onClick={() => openEdit(p)} style={{ padding: 6, background: 'var(--bg-glass)', border: '1px solid var(--surface-border)', borderRadius: 6, cursor: 'pointer', color: 'var(--text-secondary)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ padding: 6, background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={14} /></button>
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
            <Package size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No products found.</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {showModal && editProduct && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ padding: '24px 20px' }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{products.find(p => p.id === editProduct.id) ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Image Upload in Modal */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Product Image</div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
                {imagePreview ? (
                  <div style={{ position: 'relative', marginBottom: 4 }}>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }} />
                    <button type="button" onClick={() => { setImagePreview(''); setEditProduct({ ...editProduct, image: '' }); }}
                      style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                      <X size={14} />
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'white', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ImageIcon size={12} /> Change
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ border: '2px dashed var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-glass)' }}>
                    <Upload size={22} color="var(--text-muted)" style={{ marginBottom: 6 }} />
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tap to upload image</p>
                  </div>
                )}
              </div>

              <div className="responsive-form-grid" style={{ marginBottom: 16 }}>
                <div className="float-label"><label>Product Name</label><input className="input-field" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} /></div>
                <div className="float-label"><label>Product Code</label><input className="input-field" value={editProduct.code} onChange={(e) => setEditProduct({ ...editProduct, code: e.target.value })} /></div>
                <div className="float-label"><label>Category</label><select className="select-field" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div className="float-label"><label>Subcategory</label><input className="input-field" value={editProduct.subcategory} onChange={(e) => setEditProduct({ ...editProduct, subcategory: e.target.value })} /></div>
                <div className="float-label"><label>Bottle Type</label><select className="select-field" value={editProduct.bottleType} onChange={(e) => setEditProduct({ ...editProduct, bottleType: e.target.value })}>{bottleTypes.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div className="float-label"><label>Label Type</label><select className="select-field" value={editProduct.labelType} onChange={(e) => setEditProduct({ ...editProduct, labelType: e.target.value })}>{labelTypes.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                <div className="float-label"><label>Packaging</label><select className="select-field" value={editProduct.packagingType} onChange={(e) => setEditProduct({ ...editProduct, packagingType: e.target.value })}>{packagingTypes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                <div className="float-label"><label>Size</label><input className="input-field" value={editProduct.size} onChange={(e) => setEditProduct({ ...editProduct, size: e.target.value })} /></div>
                <div className="float-label"><label>Color</label><input className="input-field" value={editProduct.color} onChange={(e) => setEditProduct({ ...editProduct, color: e.target.value })} /></div>
                <div className="float-label"><label>Quantity</label><input className="input-field" type="number" value={editProduct.quantity} onChange={(e) => setEditProduct({ ...editProduct, quantity: parseInt(e.target.value) || 0 })} /></div>
              </div>

              <div className="float-label" style={{ marginBottom: 12 }}><label>Description</label><textarea className="input-field" rows={2} value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 12 }}><label>Admin Notes</label><textarea className="input-field" rows={2} value={editProduct.notes} onChange={(e) => setEditProduct({ ...editProduct, notes: e.target.value })} style={{ resize: 'vertical' }} /></div>
              <div className="float-label" style={{ marginBottom: 16 }}><label>Worker Instructions</label><textarea className="input-field" rows={2} value={editProduct.instructions} onChange={(e) => setEditProduct({ ...editProduct, instructions: e.target.value })} style={{ resize: 'vertical' }} /></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <input type="checkbox" id="cocreate-modal" checked={editProduct.isCocreate} onChange={(e) => setEditProduct({ ...editProduct, isCocreate: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
                <label htmlFor="cocreate-modal" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>Co-Create Product</label>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewProduct && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewProduct(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} style={{ padding: '24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{viewProduct.name}</h2>
                <button onClick={() => setViewProduct(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {viewProduct.image && (
                <img src={viewProduct.image} alt={viewProduct.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 20, border: '1px solid var(--surface-border)' }} />
              )}

              <div className="responsive-form-grid" style={{ gap: 14, marginBottom: 16 }}>
                {[
                  ['Product Code', viewProduct.code], ['Category', `${viewProduct.category} › ${viewProduct.subcategory}`],
                  ['Bottle Type', viewProduct.bottleType], ['Label Type', viewProduct.labelType],
                  ['Packaging', viewProduct.packagingType], ['Size', viewProduct.size],
                  ['Color', viewProduct.color], ['Quantity', viewProduct.quantity.toLocaleString()],
                  ['Status', viewProduct.status], ['Co-Create', viewProduct.isCocreate ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>

              {viewProduct.description && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{viewProduct.description}</div>
                </div>
              )}
              {viewProduct.notes && (
                <div style={{ marginBottom: 10, padding: 14, background: 'var(--warning-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning)', marginBottom: 4 }}>Admin Notes</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.notes}</div>
                </div>
              )}
              {viewProduct.instructions && (
                <div style={{ padding: 14, background: 'var(--info-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--info)', marginBottom: 4 }}>Worker Instructions</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{viewProduct.instructions}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
