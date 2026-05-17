'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';
import Papa from 'papaparse';

export default function BulkImportPage() {
  const { fetchData, user } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; failed: number; duplicates: number } | null>(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'text/csv' && !selected.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }
      setFile(selected);
      setError('');
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(10);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          setProgress(40);
          const rows = results.data as any[];
          
          if (rows.length === 0) {
            throw new Error("The CSV file is empty.");
          }

          const parsedProducts: Product[] = [];
          let failedCount = 0;

          rows.forEach((row, index) => {
            // Mapping CSV headers to our Product schema
            // Expected CSV headers: Product Code, Product Name, Category, Bottle Type, Label Type, CFB Size, Quantity, Status
            
            const code = row['Product Code'] || row['code'] || row['Code'];
            const name = row['Product Name'] || row['name'] || row['Name'] || row['Title'];
            
            if (!code || !name) {
              failedCount++;
              return; // Skip invalid rows
            }

            const stockStr = row['Quantity'] || row['quantity'] || row['Stock'] || '0';
            const priceStr = row['Price'] || row['price'] || '0';

            parsedProducts.push({
              id: `PRD-BULK-${Date.now()}-${index}`,
              code: code.toString().trim(),
              name: name.toString().trim(),
              category: (row['Category'] || row['category'] || 'Uncategorized').toString().trim(),
              tags: [],
              images: [],
              image: '',
              price: parseFloat(priceStr) || 0,
              stock: parseInt(stockStr, 10) || 0,
              specifications: {
                "Bottle Type": row['Bottle Type'] || row['bottleType'] || '',
                "Label Type": row['Label Type'] || row['labelType'] || '',
                "CFB Size": row['CFB Size'] || row['cfbSize'] || '',
                "Packaging": row['Packaging'] || row['packaging'] || '',
              },
              description: row['Description'] || row['description'] || '',
              notes: 'Imported via Bulk Upload',
              instructions: '',
              isCocreate: false,
              status: (row['Status'] || row['status'] || 'active').toString().toLowerCase() as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: user?.name || 'Admin',
            });
          });

          setProgress(70);

          if (parsedProducts.length === 0) {
            throw new Error("No valid products found. Ensure headers match expected format.");
          }

          // Send batch to API
          const response = await fetch('/api/products/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedProducts),
          });

          if (!response.ok) {
            throw new Error("Server failed to process the bulk import.");
          }

          const data = await response.json();
          
          setProgress(100);
          setResult({
            success: parsedProducts.length,
            failed: failedCount,
            duplicates: 0 // De-duplication is handled securely by backend via Product Code overwriting
          });
          
          // Refresh local store to show new products instantly
          await fetchData();
          
        } catch (err: any) {
          setError(err.message || 'An error occurred while parsing the file.');
        } finally {
          setTimeout(() => {
            setLoading(false);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }, 500);
        }
      },
      error: (error) => {
        setError(`CSV Parse Error: ${error.message}`);
        setLoading(false);
      }
    });
  };

  const generateSampleCSV = () => {
    const headers = ['Product Code', 'Product Name', 'Category', 'Bottle Type', 'Label Type', 'CFB Size', 'Quantity', 'Status'];
    const sampleRows = [
      ['BOT-001', 'Aqua Clear 500ml', 'Beverages', 'PET Round', 'Shrink Sleeve', '500ml', '1200', 'active'],
      ['BOT-002', 'Hand Soap Dispenser', 'Personal Care', 'PET Pump', 'Self-Adhesive', '250ml', '850', 'active'],
    ];
    
    const csvContent = [headers.join(','), ...sampleRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'anticbuddy_sample_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Bulk Import Products</h1>
        <p className="page-subtitle">Upload a CSV file to mass-import or update products.</p>
      </div>

      <div className="glass-card" style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
        
        {/* Upload Area */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          style={{ 
            border: '2px dashed var(--surface-border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '40px 20px', 
            textAlign: 'center', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            background: file ? 'var(--accent-subtle)' : 'var(--bg-glass)', 
            transition: 'all 0.2s',
            marginBottom: 20
          }}
        >
          <FileSpreadsheet size={40} color={file ? 'var(--accent-hover)' : 'var(--text-muted)'} style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: file ? 'var(--accent-hover)' : 'var(--text-primary)' }}>
            {file ? file.name : 'Tap to select CSV file'}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {file ? ((file.size / 1024).toFixed(1) + ' KB') : 'Download the sample CSV below to see the required format.'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '12px 16px', background: 'var(--danger-subtle)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--danger)' }}>
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '16px', background: 'var(--success-subtle)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 14, color: 'var(--text-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontWeight: 700, marginBottom: 12 }}>
              <CheckCircle size={18} /> Import Completed
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'var(--bg-primary)', padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Successfully Imported</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>{result.success}</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Skipped / Failed</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: result.failed > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{result.failed}</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>* Duplicate product codes were automatically merged/updated.</p>
          </motion.div>
        )}

        {loading && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <div className="confidence-bar">
              <motion.div className="confidence-fill" initial={{ width: 0 }} animate={{ width: progress + '%' }} style={{ background: 'var(--accent)' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={generateSampleCSV} style={{ flex: 1, fontSize: 13 }} disabled={loading}>
            Download Sample CSV
          </button>
          <button className="btn-primary" onClick={handleImport} style={{ flex: 1, fontSize: 13 }} disabled={!file || loading}>
            {loading ? <RefreshCw size={16} className="spin" /> : <Upload size={16} />} 
            Start Import
          </button>
        </div>

      </div>
    </div>
  );
}
