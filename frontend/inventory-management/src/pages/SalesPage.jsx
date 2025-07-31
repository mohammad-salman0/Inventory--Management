import { useContext, useState } from "react";
import { InventoryContext } from "../context/InventoryContext";

function SalesPage() {
  const { items, sales, addSale } = useContext(InventoryContext);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);

  const handleAddSale = (e) => {
    e.preventDefault();

    const item = items.find((it) => it.id === Number(selectedItemId));
    const qty = Number(quantity);

    if (!item) {
      setError("Please select a valid item.");
      return;
    }
    if (qty <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }
    if (qty > item.quantity) {
      setError(
        `Not enough inventory. Only ${item.quantity} left for ${item.name}.`,
      );
      return;
    }

    setError(null);

    addSale({
      id: Date.now(),
      itemId: item.id,
      itemName: item.name,
      quantity: qty,
      date: new Date().toISOString(),
    });

    // Reset form
    setSelectedItemId("");
    setQuantity("");
  };

  // Compute daily sales summary
  const salesByDate = sales.reduce((acc, sale) => {
    const dateKey = sale.date.slice(0, 10); // YYYY-MM-DD
    if (!acc[dateKey]) acc[dateKey] = 0;
    acc[dateKey] += sale.quantity;
    return acc;
  }, {});

  const sortedDates = Object.keys(salesByDate).sort((a, b) => (a > b ? -1 : 1));

  return (
    <main className="main-content">
      <h2>Sales Management</h2>

      <form onSubmit={handleAddSale} className="add-item-form" style={{ maxWidth: "400px", marginBottom: "2rem" }}>
        <select
          value={selectedItemId}
          onChange={(e) => setSelectedItemId(e.target.value)}
          required
          style={{ flex: 1 }}
        >
          <option value="" disabled>
            Select Item
          </option>
          {items.map((item) => (
            <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
              {item.name} (Available: {item.quantity})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          required
          style={{ width: "100px" }}
        />
        <button type="submit">Add Sale</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Daily Sales Insights</h3>
      {sortedDates.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <table style={{ width: "100%", maxWidth: "600px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th>Date</th>
              <th>Total Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {sortedDates.map((date) => (
              <tr key={date} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px 12px" }}>{date}</td>
                <td style={{ textAlign: "center" }}>{salesByDate[date]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default SalesPage;
