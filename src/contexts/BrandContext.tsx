import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Brand = 'poetic' | 'modern';

interface BrandContextType {
  brand: Brand;
  brandName: string;
  brandTagline: string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brand, setBrand] = useState<Brand>(() => {
    // Check if user already has an assigned brand
    const stored = localStorage.getItem('brand-test');
    if (stored === 'poetic' || stored === 'modern') {
      return stored;
    }
    
    // Randomly assign 50/50 for new users
    const random = Math.random() < 0.5 ? 'poetic' : 'modern';
    localStorage.setItem('brand-test', random);
    return random;
  });

  const brandName = brand === 'poetic' ? 'Chapter & Verse' : 'Verso';
  const brandTagline = brand === 'poetic' 
    ? 'Discover Your Next Great Read'
    : 'Books Reimagined';

  return (
    <BrandContext.Provider value={{ brand, brandName, brandTagline }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
};
