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
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addActivityLog: (log: ActivityLog) => void;
  addRecognitionLog: (log: RecognitionLog) => void;
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
      addProduct: (product) => set((s) => ({ products: [product, ...s.products] })),
      updateProduct: (id, updates) => set((s) => ({
        products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      })),
      deleteProduct: (id) => set((s) => ({
        products: s.products.filter((p) => p.id !== id),
      })),
      addActivityLog: (log) => set((s) => ({ activityLogs: [log, ...s.activityLogs] })),
      addRecognitionLog: (log) => set((s) => ({ recognitionLogs: [log, ...s.recognitionLogs] })),
    }),
    {
      name: 'anticbuddy-store', // key in localStorage
      partialize: (s) => ({
        user: s.user,
        products: s.products,
        activityLogs: s.activityLogs,
        recognitionLogs: s.recognitionLogs,
        theme: s.theme,
      }),
    }
  )
);
