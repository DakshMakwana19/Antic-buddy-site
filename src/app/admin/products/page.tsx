'use client';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, Package, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';

type EditableProduct = Omit<Product, 'quantity'> & { quantity: number | string };

const emptyProduct = (): EditableProduct => ({
  id: '', name: '', code: '', category: '', subcategory: '',
  bottleType: '', labelType: '', packagingType: '',
  size: '', color: '', quantity: 0, description: '', notes: '', instructions: '',
  isCocreate: false, image: '', status: 'active',
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0],
});

export default function ProductsPage() {
  const { products, deleteProduct, updateProduct, addProduct } = useAppStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<EditableProduct>(emptyProduct());
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setEditProduct(prev => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product permanently?')) deleteProduct(id);
  };

  const openEdit = (product: Product) => {
    setEditProduct({ ...product });
    setImagePreview(product.image || '');
    setIsEditing(true);
    setShowModal(true);
  };

  const openAdd = () => {
    const newId = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    setEditProduct({ ...emptyProduct(), id: newId });
    setImagePreview('');
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editProduct.name || !editProduct.code) {
      alert('Product Name and Code are required.');
      return;
    }
    const finalProduct: Product = {
      ...editProduct,
      quantity: Number(editProduct.quantity) || 0,
      image: imagePreview || editProduct.image || '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (isEditing) {
      updateProduct(finalProduct.id, finalProduct);
    } else {
      addProduct(finalProduct);
    }
    setShowModal(false);
  };

  const closeModal = () => { setShowModal(false); setImagePreview(''); };

  const Field = ({ label, k, placeholder, type = 'text' }: { label: string; k: keyof EditableProduct; placeholder?: string; type?: string }) => (
    <div className="float-label">
      <label>{label}</label>
      <input
        className="input-field"
        type={type}
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
          <h1 className="page-title" style={{ marginBottom: 4 }}>Products</h1>
          <p className="page-subtitle">{products.length} total · {filtered.length} showing</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div className="search-wrapper">
          <Search size={16} />
          <input className="input-field" placeholder="Search by name, code or category..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
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
                <th>Size / Qty</th>
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
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.bottleType || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-hover)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 4 }}>{p.code}</code></td>
                    <td style={{ fontSize: 13 }}>{p.category || '—'}</td>
                    <td style={{ fontSize: 13 }}>{p.size || '—'} · <strong>{p.quantity.toLocaleString()}</strong></td>
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
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{products.length === 0 ? 'No products yet. Click "Add Product" to get started.' : 'No products match your search.'}</p>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} style={{ padding: '22px 18px' }}>

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
                <Field label="Category" k="category" placeholder="e.g. Beverages" />
                <Field label="Subcategory" k="subcategory" placeholder="e.g. Water" />
                <Field label="Bottle Type" k="bottleType" placeholder="e.g. PET Round" />
                <Field label="Label Type" k="labelType" placeholder="e.g. Shrink Sleeve" />
                <Field label="Packaging" k="packagingType" placeholder="e.g. Carton 12-pack" />
                <Field label="Size" k="size" placeholder="e.g. 500ml" />
                <Field label="Color" k="color" placeholder="e.g. Clear" />
                <Field label="Quantity" k="quantity" type="number" />
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewProduct(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} style={{ padding: '22px 18px' }}>
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
                  ['Bottle Type', viewProduct.bottleType], ['Label Type', viewProduct.labelType],
                  ['Packaging', viewProduct.packagingType], ['Size', viewProduct.size],
                  ['Color', viewProduct.color], ['Quantity', viewProduct.quantity.toLocaleString()],
                  ['Status', viewProduct.status], ['Co-Create', viewProduct.isCocreate ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{val || '—'}</div>
                  </div>
                ))}
              </div>

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
