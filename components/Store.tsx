
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer, Delivery } from '../types';

interface AppContextType {
  customers: Customer[];
  deliveries: Delivery[];
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (c: Customer) => void;
  deleteCustomer: (id: string) => void;
  addDelivery: (d: Omit<Delivery, 'id'>) => boolean;
  updateDelivery: (d: Delivery) => void;
  deleteDelivery: (id: string) => void;
  getDeliveriesForRange: (customerId: string, start: string, end: string) => Delivery[];
  exportDatabase: () => void;
  importDatabase: (file: File) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DB_NAME = 'TarvinsExpressDB';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('customers')) db.createObjectStore('customers', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('deliveries')) db.createObjectStore('deliveries', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(['customers', 'deliveries'], 'readonly');
      
      const custStore = tx.objectStore('customers');
      const delStore = tx.objectStore('deliveries');

      const custRequest = custStore.getAll();
      const delRequest = delStore.getAll();

      custRequest.onsuccess = () => setCustomers(custRequest.result);
      delRequest.onsuccess = () => setDeliveries(delRequest.result);
      
      tx.oncomplete = () => setIsLoaded(true);
    } catch (e) {
      console.error("Failed to load IndexedDB data", e);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveToDB = async (storeName: 'customers' | 'deliveries', data: any) => {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data);
  };

  const removeFromDB = async (storeName: 'customers' | 'deliveries', id: string) => {
    const db = await openDB();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(id);
  };

  const addCustomer = useCallback((c: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = { ...c, id: crypto.randomUUID(), createdAt: Date.now() };
    setCustomers(prev => [...prev, newCustomer]);
    saveToDB('customers', newCustomer);
  }, []);

  const updateCustomer = useCallback((c: Customer) => {
    setCustomers(prev => prev.map(item => item.id === c.id ? c : item));
    saveToDB('customers', c);
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setDeliveries(prev => {
      prev.filter(d => d.customerId === id).forEach(d => removeFromDB('deliveries', d.id));
      return prev.filter(d => d.customerId !== id);
    });
    removeFromDB('customers', id);
  }, []);

  const addDelivery = useCallback((d: Omit<Delivery, 'id'>) => {
    const exists = deliveries.find(prev => prev.customerId === d.customerId && prev.date === d.date);
    if (exists) return false;
    const newDelivery: Delivery = { ...d, id: crypto.randomUUID() };
    setDeliveries(prev => [...prev, newDelivery]);
    saveToDB('deliveries', newDelivery);
    return true;
  }, [deliveries]);

  const updateDelivery = useCallback((d: Delivery) => {
    setDeliveries(prev => prev.map(item => item.id === d.id ? d : item));
    saveToDB('deliveries', d);
  }, []);

  const deleteDelivery = useCallback((id: string) => {
    setDeliveries(prev => prev.filter(d => d.id !== id));
    removeFromDB('deliveries', id);
  }, []);

  const getDeliveriesForRange = useCallback((customerId: string, start: string, end: string) => {
    return deliveries.filter(d => 
      (customerId === 'all' || d.customerId === customerId) && 
      d.date >= start && d.date <= end
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [deliveries]);

  const exportDatabase = useCallback(() => {
    const data = JSON.stringify({ customers, deliveries }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MooMoo_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [customers, deliveries]);

  const importDatabase = useCallback(async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          if (content.customers && content.deliveries) {
            const db = await openDB();
            // Clear current data first
            const tx = db.transaction(['customers', 'deliveries'], 'readwrite');
            await tx.objectStore('customers').clear();
            await tx.objectStore('deliveries').clear();
            
            // Populate new data
            content.customers.forEach((c: any) => tx.objectStore('customers').put(c));
            content.deliveries.forEach((d: any) => tx.objectStore('deliveries').put(d));
            
            tx.oncomplete = () => {
              loadData();
              resolve(true);
            };
          } else {
            resolve(false);
          }
        } catch (err) {
          console.error("Import failed", err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }, [loadData]);

  if (!isLoaded) return <div className="h-screen w-screen bg-[#1b3a57] flex items-center justify-center text-white font-bold">Connecting MooMoo DB...</div>;

  return (
    <AppContext.Provider value={{ 
      customers, deliveries, addCustomer, updateCustomer, deleteCustomer,
      addDelivery, updateDelivery, deleteDelivery, getDeliveriesForRange,
      exportDatabase, importDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
