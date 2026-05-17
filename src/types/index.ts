export interface Product {
  id: string;
  name: string; // Used as title
  code: string;
  category: string;
  tags: string[];
  images: string[];
  image: string; // Kept for backward compatibility
  price: number;
  stock: number;
  specifications: Record<string, string>;
  description: string;
  notes: string;
  instructions: string;
  isCocreate: boolean;
  status: 'active' | 'discontinued' | 'draft';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  
  // Legacy fields (optional)
  subcategory?: string;
  bottleType?: string;
  labelType?: string;
  packagingType?: string;
  size?: string;
  color?: string;
  quantity?: number;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'worker';
  avatar: string;
  email: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'scan' | 'view' | 'edit' | 'create' | 'delete' | 'login';
}

export interface RecognitionLog {
  id: string;
  userId: string;
  userName: string;
  productId: string | null;
  productName: string | null;
  confidence: number;
  matched: boolean;
  timestamp: string;
  imageUrl: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalScans: number;
  recognitionRate: number;
  categoriesCount: number;
  workersActive: number;
}

