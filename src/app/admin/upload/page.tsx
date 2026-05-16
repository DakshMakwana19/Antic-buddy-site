'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Package, X, Check, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { categories, bottleTypes, labelTypes, packagingTypes } from '@/lib/data';

export default function UploadPage() {
  const { addProduct, products } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', code: '', category: 'Beverages', subcategory: '',
    bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack',
    size: '', color: '', quantity: 0, description: '', notes: '', instructions: '',
    isCocreate: false,
  });

  const update = (key: string, value: string | number | boolean) => setForm(f => ({ ...f, [key]: value }));

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    addProduct({
      ...form,
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      image: imagePreview,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ name: '', code: '', category: 'Beverages', subcategory: '', bottleType: 'PET Round', labelType: 'Shrink Sleeve', packagingType: 'Carton 12-pack', size: '', color: '', quantity: 0, description: '', notes: '', instructions: '', isCocreate: false });
    setImagePreview('');
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Add Product</h1>
        <p className="page-subtitle">Add a new product to the database.</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 20px', background: 'var(--success-subtle)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>
          <Check size={18} /> Product added successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="responsive-form-layout" style={{ gap: 20 }}>
          {/* Left — Form Fields */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Product Details</h3>

            <div className="responsive-form-grid" style={{ marginBottom: 16 }}>
              <div className="float-label"><label>Product Name *</label><input className="input-field" required value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. AquaPure Crystal 500ml" /></div>
              <div className="float-label"><label>Product Code *</label><input className="input-field" required value={form.code} onChange={e => update('code', e.target.value)} placeholder="e.g. APC-500" /></div>
              <div className="float-label"><label>Category</label><select className="select-field" value={form.category} onChange={e => update('category', e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="float-label"><label>Subcategory</label><input className="input-field" value={form.subcategory} onChange={e => update('subcategory', e.target.value)} placeholder="e.g. Water, Juice" /></div>
              <div className="float-label"><label>Bottle Type</label><select className="select-field" value={form.bottleType} onChange={e => update('bottleType', e.target.value)}>{bottleTypes.map(b => <option key={b}>{b}</option>)}</select></div>
              <div className="float-label"><label>Label Type</label><select className="select-field" value={form.labelType} onChange={e => update('labelType', e.target.value)}>{labelTypes.map(l => <option key={l}>{l}</option>)}</select></div>
              <div className="float-label"><label>Packaging</label><select className="select-field" value={form.packagingType} onChange={e => update('packagingType', e.target.value)}>{packagingTypes.map(p => <option key={p}>{p}</option>)}</select></div>
              <div className="float-label"><label>Size</label><input className="input-field" value={form.size} onChange={e => update('size', e.target.value)} placeholder="e.g. 500ml, 1L" /></div>
              <div className="float-label"><label>Color</label><input className="input-field" value={form.color} onChange={e => update('color', e.target.value)} placeholder="e.g. Clear, Blue" /></div>
              <div className="float-label"><label>Quantity</label><input className="input-field" type="number" value={form.quantity} onChange={e => update('quantity', parseInt(e.target.value) || 0)} /></div>
            </div>

            <div className="float-label" style={{ marginBottom: 16 }}><label>Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => update('description', e.target.value)} style={{ resize: 'vertical' }} /></div>
            <div className="float-label" style={{ marginBottom: 16 }}><label>Admin Notes</label><textarea className="input-field" rows={2} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Internal notes for reference..." style={{ resize: 'vertical' }} /></div>
            <div className="float-label" style={{ marginBottom: 16 }}><label>Worker Instructions</label><textarea className="input-field" rows={2} value={form.instructions} onChange={e => update('instructions', e.target.value)} placeholder="Instructions workers will see..." style={{ resize: 'vertical' }} /></div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: 24 }}>
              <input type="checkbox" checked={form.isCocreate} onChange={e => update('isCocreate', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} /> Co-Create Product
            </label>

            <button type="submit" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              <Package size={16} /> Save Product
            </button>
          </div>

          {/* Right — Image Upload */}
          <div>
            <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Product Image</h3>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />

              {imagePreview ? (
                /* Image Preview */
                <div style={{ position: 'relative' }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 240, border: '1px solid var(--surface-border)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                      width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'white',
                    }}
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: 10, fontSize: 13 }}
                  >
                    <ImageIcon size={14} /> Change Image
                  </button>
                </div>
              ) : (
                /* Drop Zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--surface-border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '36px 20px', textAlign: 'center',
                    cursor: 'pointer', background: dragOver ? 'var(--accent-subtle)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Upload size={32} color={dragOver ? 'var(--accent-hover)' : 'var(--text-muted)'} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: dragOver ? 'var(--accent-hover)' : 'var(--text-primary)' }}>
                    Tap to upload or drag & drop
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Photo Tips</h3>
              {['Use clear, well-lit photos', 'Show bottle shape & label clearly', 'Include front and back views', 'White/neutral background preferred'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-hover)', fontWeight: 700 }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
