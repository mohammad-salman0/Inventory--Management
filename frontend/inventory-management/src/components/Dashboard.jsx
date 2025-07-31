import { useContext, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";
import InventoryList from "./InventoryList";
import AddItemForm from "./AddItemForm";
import EditItemForm from "./EditItemForm";

function Dashboard() {
  const { items, addItem, editItem, deleteItem } = useContext(InventoryContext);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = (item) => addItem(item);
  const handleEditSave = (item) => {
    editItem(item);
    setEditingItem(null);
  };
  const handleDelete = (id) => deleteItem(id);

  return (
    <main className="main-content">
      <AddItemForm onAdd={handleAdd} />
      <InventoryList items={items} onEdit={setEditingItem} onDelete={handleDelete} />
      {editingItem && (
        <EditItemForm
          item={editingItem}
          onSave={handleEditSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </main>
  );
}

export default Dashboard;
