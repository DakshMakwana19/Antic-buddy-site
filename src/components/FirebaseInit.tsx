'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function FirebaseInit() {
  const initFirebaseListeners = useAppStore(s => s.initFirebaseListeners);

  useEffect(() => {
    const unsub = initFirebaseListeners();
    return () => unsub();
  }, [initFirebaseListeners]);

  return null;
}
