import { useContext, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";
import InventoryList from "../components/InventoryList";
import EditItemForm from "../components/EditItemForm";

function InventoryPage() {
  const { items, editItem, deleteItem } = useContext(InventoryContext);
  const [editingItem, setEditingItem] = useState(null);

  // Handle saving edited item
  const handleSave = (updatedItem) => {
    editItem(updatedItem);
    setEditingItem(null);
  };

  // Cancel editing mode
  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <main className="main-content" style={{ paddingTop: "0" }}>
      <h2 style={{ marginBottom: "1.5rem", color: "#374151" }}>Inventory Management</h2>
      
      {/* Inventory List: pass items and handlers */}
      <InventoryList items={items} onEdit={setEditingItem} onDelete={deleteItem} />

      {/* Show Edit form modal only if editingItem is set */}
      {editingItem && (
        <EditItemForm item={editingItem} onSave={handleSave} onClose={handleCancel} />
      )}
    </main>
  );
}

export default InventoryPage;
