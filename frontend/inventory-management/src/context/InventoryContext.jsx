import React, { createContext, useState } from 'react';

// Create context
export const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);

  // Add new item
  const addItem = (item) => setItems((prev) => [...prev, item]);

  // Edit existing item
  const editItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  // Delete item
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add new sale
  const addSale = (sale) => {
    setSales((prev) => [...prev, sale]);
    
    // Reduce quantity from inventory items accordingly
    setItems((prev) =>
      prev.map((item) =>
        item.id === sale.itemId
          ? { ...item, quantity: item.quantity - sale.quantity }
          : item,
      ),
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        editItem,
        deleteItem,
        sales,
        addSale,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
