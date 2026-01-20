
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// IndexedDB Helper
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

  // Load from IndexedDB
  useEffect(() => {
    const loadData = async () => {
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
    };
    loadData();
  }, []);

  // Generic Save Helper
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
    const newCustomer: Customer = {
      ...c,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
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
      const filtered = prev.filter(d => d.customerId !== id);
      // Clean up linked deliveries in DB
      prev.filter(d => d.customerId === id).forEach(d => removeFromDB('deliveries', d.id));
      return filtered;
    });
    removeFromDB('customers', id);
  }, []);

  const addDelivery = useCallback((d: Omit<Delivery, 'id'>) => {
    const exists = deliveries.find(prev => prev.customerId === d.customerId && prev.date === d.date);
    if (exists) return false;

    const newDelivery: Delivery = {
      ...d,
      id: crypto.randomUUID(),
    };
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
      d.date >= start && 
      d.date <= end
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [deliveries]);

  if (!isLoaded) return <div className="h-screen w-screen bg-[#1b3a57] flex items-center justify-center text-white font-bold">Initializing Database...</div>;

  return (
    <AppContext.Provider value={{ 
      customers, 
      deliveries, 
      addCustomer, 
      updateCustomer, 
      deleteCustomer,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDeliveriesForRange
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
