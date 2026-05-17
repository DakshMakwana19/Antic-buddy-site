'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function AppInitializer() {
  const fetchData = useAppStore(s => s.fetchData);

  useEffect(() => {
    fetchData();
    
    // Optional: Refresh data periodically for pseudo-realtime feel
    const interval = setInterval(() => {
      fetchData();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  return null;
}
