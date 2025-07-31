import InventoryItem from './InventoryItem';

function InventoryList({ items, onEdit, onDelete }) {
  return (
    <div className="inventory-list">
      <h2>Inventory Items</h2>
      {items.length === 0 ? (
        <p>No items in inventory.</p>
      ) : (
        <ul>
          {items.map(item => (
            <InventoryItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default InventoryList;
