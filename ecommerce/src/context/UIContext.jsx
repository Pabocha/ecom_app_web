import React, { createContext, useState, useCallback } from 'react';

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const openCategoryModal = useCallback(() => {
    setCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setCategoryModalOpen(false);
  }, []);

  const value = {
    categoryModalOpen,
    openCategoryModal,
    closeCategoryModal,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}
