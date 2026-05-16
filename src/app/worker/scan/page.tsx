'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search, Package, AlertCircle, CheckCircle, RotateCcw, Zap, Info, Box, Tag, FileText } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function ScanPage() {
  const { products, addRecognitionLog } = useAppStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof products[0] | null>(null);
  const [noMatch, setNoMatch] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch {
      alert('Camera access denied or not available. Use manual search instead.');
      setSearchMode(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const simulateScan = useCallback(() => {
    setScanning(true);
    setResult(null);
    setNoMatch(false);
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.15) {
        const product = products[Math.floor(Math.random() * products.length)];
        const conf = 85 + Math.random() * 14;
        setResult(product);
        setConfidence(Math.round(conf * 10) / 10);
        addRecognitionLog({
          id: `RL-${Date.now()}`, userId: 'U-002', userName: 'Worker',
          productId: product.id, productName: product.name,
          confidence: Math.round(conf * 10) / 10, matched: true,
          timestamp: new Date().toISOString(), imageUrl: '',
        });
      } else {
        setNoMatch(true);
        setConfidence(25 + Math.random() * 20);
        addRecognitionLog({
          id: `RL-${Date.now()}`, userId: 'U-002', userName: 'Worker',
          productId: null, productName: null,
          confidence: Math.round((25 + Math.random() * 20) * 10) / 10, matched: false,
          timestamp: new Date().toISOString(), imageUrl: '',
        });
      }
      setScanning(false);
    }, 2500);
  }, [products, addRecognitionLog]);

  const searchResults = searchQuery.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const reset = () => { setResult(null); setNoMatch(false); setSearchMode(false); setSearchQuery(''); };

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
          <Camera size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          AI Product Scanner
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Point camera at any product or search manually</p>
      </div>

      <AnimatePresence mode="wait">
        {/* RESULT VIEW */}
        {(result || noMatch) ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {result ? (
              <>
                {/* Match Header */}
                <div style={{ textAlign: 'center', marginBottom: 20, padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--success-subtle)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle size={32} color="var(--success)" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>Product Identified!</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Confidence: <span style={{ fontWeight: 700, color: 'var(--success)' }}>{confidence}%</span></div>
                  <div className="confidence-bar" style={{ maxWidth: 200, margin: '10px auto 0' }}>
                    <motion.div className="confidence-fill" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 1 }}
                      style={{ background: 'var(--success)' }} />
                  </div>
                </div>

                {/* Product Card */}
                <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={26} color="var(--accent-hover)" />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>{result.name}</h2>
                      <code style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-hover)', background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 4 }}>{result.code}</code>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    {[
                      { icon: Tag, label: 'Category', val: `${result.category} › ${result.subcategory}` },
                      { icon: Box, label: 'Bottle Type', val: result.bottleType },
                      { icon: FileText, label: 'Label', val: result.labelType },
                      { icon: Package, label: 'Packaging', val: result.packagingType },
                    ].map(d => (
                      <div key={d.label} style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <d.icon size={12} color="var(--text-muted)" />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d.label}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{d.val}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Size</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{result.size}</div>
                    </div>
                    <div style={{ flex: 1, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Color</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{result.color}</div>
                    </div>
                    <div style={{ flex: 1, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Stock</div>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{result.quantity.toLocaleString()}</div>
                    </div>
                  </div>

                  {result.description && (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{result.description}</p>
                  )}
                </div>

                {/* Instructions */}
                {result.instructions && (
                  <div style={{ padding: 16, background: 'var(--info-subtle)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--info)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Info size={14} /> Worker Instructions
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.instructions}</div>
                  </div>
                )}
                {result.notes && (
                  <div style={{ padding: 16, background: 'var(--warning-subtle)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={14} /> Important Notes
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.notes}</div>
                  </div>
                )}
              </>
            ) : (
              /* No Match */
              <div style={{ textAlign: 'center', padding: 32, marginBottom: 16 }}>
                <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Product Not Recognized</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Confidence was too low ({confidence.toFixed(1)}%). Try again or search manually.</p>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Suggested matches:</div>
                {products.slice(0, 3).map(p => (
                  <div key={p.id} onClick={() => { setResult(p); setNoMatch(false); setConfidence(75); }}
                    className="glass-card" style={{ padding: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Package size={18} color="var(--accent-hover)" />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.code}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-primary" onClick={reset} style={{ width: '100%', padding: '14px 0', fontSize: 15 }}>
              <RotateCcw size={16} /> Scan Again
            </button>
          </motion.div>
        ) : (
          /* SCANNER VIEW */
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {!searchMode ? (
              <>
                {/* Camera View */}
                <div className="camera-view" style={{ marginBottom: 20 }}>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!cameraActive && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)' }}>
                      <Camera size={48} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Camera preview</p>
                    </div>
                  )}
                  {scanning && <div className="scanner-line" />}
                  {/* Corner markers */}
                  {[{ top: 20, left: 20 }, { top: 20, right: 20 }, { bottom: 20, left: 20 }, { bottom: 20, right: 20 }].map((pos, i) => (
                    <div key={i} style={{ position: 'absolute', ...pos, width: 30, height: 30, borderColor: scanning ? 'var(--accent)' : 'rgba(255,255,255,0.3)', borderWidth: 2, borderStyle: 'solid',
                      borderTop: i < 2 ? undefined : 'none', borderBottom: i >= 2 ? undefined : 'none',
                      borderLeft: i % 2 === 0 ? undefined : 'none', borderRight: i % 2 === 1 ? undefined : 'none',
                      borderRadius: 4, transition: 'border-color 0.3s',
                    }} />
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <button className={cameraActive ? 'btn-danger' : 'btn-primary'} onClick={cameraActive ? stopCamera : startCamera}
                    style={{ padding: '14px 0', fontSize: 15 }}>
                    <Camera size={18} /> {cameraActive ? 'Stop Camera' : 'Start Camera'}
                  </button>
                  <button className="btn-primary" onClick={simulateScan} disabled={scanning}
                    style={{ padding: '14px 0', fontSize: 15, opacity: scanning ? 0.7 : 1 }}>
                    {scanning ? (
                      <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Scanning...</>
                    ) : (
                      <><Zap size={18} /> Scan Now</>
                    )}
                  </button>
                </div>

                <button className="btn-secondary" onClick={() => setSearchMode(true)} style={{ width: '100%', padding: '12px 0', fontSize: 14 }}>
                  <Search size={16} /> Manual Search Instead
                </button>
              </>
            ) : (
              /* MANUAL SEARCH */
              <>
                <div style={{ marginBottom: 16 }}>
                  <div className="search-wrapper">
                    <Search size={16} />
                    <input className="input-field" placeholder="Type product name or code..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                      style={{ paddingLeft: 42, fontSize: 16, padding: '14px 14px 14px 42px' }} />
                  </div>
                </div>

                {searchResults.map(p => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => { setResult(p); setConfidence(100); setSearchMode(false); setSearchQuery(''); }}
                    className="glass-card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={20} color="var(--accent-hover)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.code} · {p.bottleType} · {p.size}</div>
                    </div>
                  </motion.div>
                ))}

                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Package size={32} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No products found</p>
                  </div>
                )}

                <button className="btn-secondary" onClick={() => setSearchMode(false)} style={{ width: '100%', padding: '12px 0', fontSize: 14, marginTop: 12 }}>
                  <Camera size={16} /> Back to Camera
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
