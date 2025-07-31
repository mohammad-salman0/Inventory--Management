import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErr("Username and password required.");
      return;
    }
    setErr(null);
    // Replace with real authentication later
    onLogin({ username });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(115deg,#6c63ff 30%,#e2e6ef 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form className="login-form" onSubmit={handleSubmit} style={{ minWidth: "320px" }}>
        <h2 style={{ marginBottom: "1rem", color: "#374151", width: "100%" }}>Inventory Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoFocus
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%" }}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
        {err && (
          <div style={{ color: "red", marginTop: ".5rem", width: "100%" }}>{err}</div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
