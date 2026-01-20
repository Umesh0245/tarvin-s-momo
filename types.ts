
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  defaultPrice: number;
  createdAt: number;
}

export interface Delivery {
  id: string;
  customerId: string;
  date: string; // ISO format YYYY-MM-DD
  quantity: number; // Litres
  priceAtTime: number; // Price per litre at delivery time
  totalAmount: number;
}

export type TabType = 'home' | 'entry' | 'customers' | 'reports';

export interface DailySummary {
  date: string;
  totalLitres: number;
  totalAmount: number;
  count: number;
}
