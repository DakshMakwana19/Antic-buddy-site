'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, ActivityLog, RecognitionLog } from '@/types';
import { db } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

interface AppState {
  user: User | null;
  products: Product[];
  activityLogs: ActivityLog[];
  recognitionLogs: RecognitionLog[];
  theme: 'dark' | 'light';
  sidebarOpen: boolean;

  setUser: (user: User | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Firebase actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addActivityLog: (log: ActivityLog) => Promise<void>;
  addRecognitionLog: (log: RecognitionLog) => Promise<void>;

  // Init listeners
  initFirebaseListeners: () => () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      products: [],
      activityLogs: [],
      recognitionLogs: [],
      theme: 'dark',
      sidebarOpen: true,

      setUser: (user) => set({ user }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      addProduct: async (product) => {
        try {
          await setDoc(doc(db, 'products', product.id), product);
        } catch (error) {
          console.error("Firebase addProduct error:", error);
          // Fallback to local state if Firebase not configured
          set((s) => ({ products: [product, ...s.products] }));
        }
      },
      updateProduct: async (id, updates) => {
        try {
          await updateDoc(doc(db, 'products', id), updates);
        } catch (error) {
          console.error("Firebase updateProduct error:", error);
          set((s) => ({
            products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }));
        }
      },
      deleteProduct: async (id) => {
        try {
          await deleteDoc(doc(db, 'products', id));
        } catch (error) {
          console.error("Firebase deleteProduct error:", error);
          set((s) => ({
            products: s.products.filter((p) => p.id !== id),
          }));
        }
      },
      addActivityLog: async (log) => {
        try {
          await setDoc(doc(db, 'activityLogs', log.id), log);
        } catch (error) {
          console.error("Firebase log error:", error);
          set((s) => ({ activityLogs: [log, ...s.activityLogs] }));
        }
      },
      addRecognitionLog: async (log) => {
        try {
          await setDoc(doc(db, 'recognitionLogs', log.id), log);
        } catch (error) {
          console.error("Firebase log error:", error);
          set((s) => ({ recognitionLogs: [log, ...s.recognitionLogs] }));
        }
      },

      initFirebaseListeners: () => {
        // We catch errors so if Firebase isn't set up yet, the app doesn't crash completely.
        try {
          const unsubProducts = onSnapshot(query(collection(db, 'products')), (snapshot) => {
            const products = snapshot.docs.map(d => d.data() as Product);
            // Sort by createdAt descending locally since we didn't add a composite index on firestore for simplicity
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            set({ products });
          }, (err) => console.error("Products listener error:", err));

          const unsubActivities = onSnapshot(query(collection(db, 'activityLogs')), (snapshot) => {
            const activityLogs = snapshot.docs.map(d => d.data() as ActivityLog);
            set({ activityLogs });
          }, (err) => console.error("Activities listener error:", err));

          const unsubRecognitions = onSnapshot(query(collection(db, 'recognitionLogs')), (snapshot) => {
            const recognitionLogs = snapshot.docs.map(d => d.data() as RecognitionLog);
            set({ recognitionLogs });
          }, (err) => console.error("Recognitions listener error:", err));

          return () => {
            unsubProducts();
            unsubActivities();
            unsubRecognitions();
          };
        } catch (err) {
          console.error("Firebase Init Error:", err);
          return () => {};
        }
      }
    }),
    {
      name: 'anticbuddy-store',
      // ONLY persist auth user and theme. Data comes from Firebase now.
      partialize: (s) => ({
        user: s.user,
        theme: s.theme,
      }),
    }
  )
);
