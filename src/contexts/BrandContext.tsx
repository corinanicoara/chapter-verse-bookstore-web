import React, { createContext, useContext, useState, ReactNode } from 'react';

type Brand = 'poetic' | 'modern';

interface BrandContextType {
  brand: Brand;
  toggleBrand: () => void;
  brandName: string;
  brandTagline: string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const [brand, setBrand] = useState<Brand>('poetic');

  const toggleBrand = () => {
    setBrand(prev => prev === 'poetic' ? 'modern' : 'poetic');
  };

  const brandName = brand === 'poetic' ? 'Chapter & Verse' : 'Verso';
  const brandTagline = brand === 'poetic' 
    ? 'Discover Your Next Great Read'
    : 'Books Reimagined';

  return (
    <BrandContext.Provider value={{ brand, toggleBrand, brandName, brandTagline }}>
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
