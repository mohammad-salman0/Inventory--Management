import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>Welcome to the Inventory Management System</h1>
      <nav style={{ marginTop: "2rem" }}>
        <Link to="/dashboard" style={{ margin: "1rem", fontSize: "1.25rem" }}>Dashboard</Link>
        <Link to="/inventory" style={{ margin: "1rem", fontSize: "1.25rem" }}>Inventory</Link>
        <Link to="/sales" style={{ margin: "1rem", fontSize: "1.25rem" }}>
  Sales
</Link>

      </nav>
    </div>
  );
}

export default Home;
