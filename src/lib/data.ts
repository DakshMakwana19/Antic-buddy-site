import { Product, ActivityLog, RecognitionLog } from '@/types';

// Start with empty data — add your real products via the Admin Panel
export const products: Product[] = [];

export const activityLogs: ActivityLog[] = [];

export const recognitionLogs: RecognitionLog[] = [];

export const categories = ['Beverages', 'Home Care', 'Personal Care', 'Food & Pantry'];
export const bottleTypes = ['PET Round', 'PET Square', 'PET Pump', 'PET Flip-top', 'PET Sport Cap', 'PET Trigger Spray', 'Glass Round', 'Glass Square', 'Glass Dark', 'HDPE Round', 'Aluminum Can', 'Aerosol Can'];
export const labelTypes = ['Shrink Sleeve', 'Self-Adhesive', 'Paper Wrap', 'Direct Print'];
export const packagingTypes = ['Carton 6-pack', 'Carton 12-pack', 'Carton 24-pack', 'Crate 6-pack', 'Crate 12-pack', 'Crate 24-pack', 'Shrink Wrap 6-pack', 'Shrink Wrap 12-pack', 'Tray 12-pack', 'Tray 24-pack', 'Individual Box'];
