'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Package, Check, Image as ImageIcon, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function UploadPage() {
  const { addProduct, products } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', code: '', category: '', subcategory: '',
    bottleType: '', labelType: '', packagingType: '',
    size: '', color: '', quantity: 0,
    description: '', notes: '', instructions: '',
    isCocreate: false,
  });

  const update = (key: string, value: string | number | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

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
    setForm({ name: '', code: '', category: '', subcategory: '', bottleType: '', labelType: '', packagingType: '', size: '', color: '', quantity: 0, description: '', notes: '', instructions: '', isCocreate: false });
    setImagePreview('');
  };

  const Field = ({ label, k, placeholder, type = 'text' }: { label: string; k: string; placeholder?: string; type?: string }) => (
    <div className="float-label">
      <label>{label}</label>
      <input
        className="input-field"
        type={type}
        placeholder={placeholder}
        value={String((form as Record<string, unknown>)[k] ?? '')}
        onChange={e => update(k, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
      />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Add Product</h1>
        <p className="page-subtitle">Add a new product to the database.</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '14px 20px', background: 'var(--success-subtle)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>
          <Check size={18} /> Product added successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="responsive-form-layout" style={{ gap: 20 }}>
          {/* Left — Form */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Product Details</h3>

            <div className="responsive-form-grid" style={{ marginBottom: 14 }}>
              <Field label="Product Name *" k="name" placeholder="e.g. AquaPure Crystal 500ml" />
              <Field label="Product Code *" k="code" placeholder="e.g. APC-500" />
              <Field label="Category" k="category" placeholder="e.g. Beverages, Home Care" />
              <Field label="Subcategory" k="subcategory" placeholder="e.g. Water, Juice" />
              <Field label="Bottle Type" k="bottleType" placeholder="e.g. PET Round, Glass" />
              <Field label="Label Type" k="labelType" placeholder="e.g. Shrink Sleeve" />
              <Field label="Packaging" k="packagingType" placeholder="e.g. Carton 12-pack" />
              <Field label="Size" k="size" placeholder="e.g. 500ml, 1L" />
              <Field label="Color" k="color" placeholder="e.g. Clear, Blue" />
              <Field label="Quantity" k="quantity" type="number" />
            </div>

            <div className="float-label" style={{ marginBottom: 12 }}>
              <label>Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => update('description', e.target.value)} style={{ resize: 'vertical' }} placeholder="Product description..." />
            </div>
            <div className="float-label" style={{ marginBottom: 12 }}>
              <label>Admin Notes</label>
              <textarea className="input-field" rows={2} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Internal notes (only visible to admin)..." style={{ resize: 'vertical' }} />
            </div>
            <div className="float-label" style={{ marginBottom: 16 }}>
              <label>Worker Instructions</label>
              <textarea className="input-field" rows={2} value={form.instructions} onChange={e => update('instructions', e.target.value)} placeholder="Instructions workers will see when they scan this product..." style={{ resize: 'vertical' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: 20 }}>
              <input type="checkbox" checked={form.isCocreate} onChange={e => update('isCocreate', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              Co-Create Product
            </label>

            <button type="submit" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15 }}>
              <Package size={16} /> Save Product
            </button>
          </div>

          {/* Right — Image Upload */}
          <div>
            <div className="glass-card" style={{ padding: 20, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Product Image</h3>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />

              {imagePreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={imagePreview} alt="preview" style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 220, border: '1px solid var(--surface-border)' }} />
                  <button type="button" onClick={() => setImagePreview('')}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <X size={14} />
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary" style={{ width: '100%', marginTop: 8, fontSize: 13 }}>
                    <ImageIcon size={14} /> Change Image
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--surface-border)'}`, borderRadius: 'var(--radius-lg)', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--accent-subtle)' : 'transparent', transition: 'all 0.2s' }}>
                  <Upload size={30} color={dragOver ? 'var(--accent-hover)' : 'var(--text-muted)'} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: dragOver ? 'var(--accent-hover)' : 'var(--text-primary)' }}>Tap to upload or drag & drop</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, WEBP · max 5MB</p>
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: 16 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Photo Tips</h3>
              {['Clear, well-lit photos work best', 'Show bottle shape & label clearly', 'White or neutral background preferred', 'Front-facing orientation ideal'].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent-hover)', fontWeight: 700, flexShrink: 0 }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
