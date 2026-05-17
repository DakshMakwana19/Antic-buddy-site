'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User, ActivityLog, RecognitionLog } from '@/types';

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
  
  // API actions
  fetchData: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addActivityLog: (log: ActivityLog) => Promise<void>;
  addRecognitionLog: (log: RecognitionLog) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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

      fetchData: async () => {
        try {
          const [productsRes, activityRes, recognitionRes] = await Promise.all([
            fetch('/api/products').then(res => res.json()),
            fetch('/api/activity').then(res => res.json()),
            fetch('/api/recognition').then(res => res.json()),
          ]);
          set({
            products: productsRes || [],
            activityLogs: activityRes || [],
            recognitionLogs: recognitionRes || [],
          });
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      },

      addProduct: async (product) => {
        try {
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          });
          set((s) => ({ products: [product, ...s.products] }));
        } catch (error) {
          console.error("Add product error:", error);
        }
      },
      updateProduct: async (id, updates) => {
        try {
          await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          set((s) => ({
            products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }));
        } catch (error) {
          console.error("Update product error:", error);
        }
      },
      deleteProduct: async (id) => {
        try {
          await fetch(`/api/products/${id}`, { method: 'DELETE' });
          set((s) => ({
            products: s.products.filter((p) => p.id !== id),
          }));
        } catch (error) {
          console.error("Delete product error:", error);
        }
      },
      addActivityLog: async (log) => {
        try {
          await fetch('/api/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
          });
          set((s) => ({ activityLogs: [log, ...s.activityLogs] }));
        } catch (error) {
          console.error("Activity log error:", error);
        }
      },
      addRecognitionLog: async (log) => {
        try {
          await fetch('/api/recognition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
          });
          set((s) => ({ recognitionLogs: [log, ...s.recognitionLogs] }));
        } catch (error) {
          console.error("Recognition log error:", error);
        }
      },
    }),
    {
      name: 'anticbuddy-store',
      // ONLY persist auth user and theme. Data comes from API now.
      partialize: (s) => ({
        user: s.user,
        theme: s.theme,
      }),
    }
  )
);
