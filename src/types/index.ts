export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  bottleType: string;
  labelType: string;
  packagingType: string;
  size: string;
  color: string;
  quantity: number;
  description: string;
  notes: string;
  instructions: string;
  isCocreate: boolean;
  image: string;
  status: 'active' | 'discontinued' | 'draft';
  createdAt: string;
  updatedAt: string;
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
