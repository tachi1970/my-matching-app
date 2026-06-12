import { useState } from "react";

const STORAGE_KEY = "app_auth";
const CORRECT_PASSWORD = "337337";

export function usePasswordGate() {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "1"
  );

  function unlock() {
    localStorage.setItem(STORAGE_KEY, "1");
    setAuthenticated(true);
  }

  return { authenticated, unlock };
}

export default function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>パスワードを入力</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="パスワード"
            autoFocus
            style={{
              ...styles.input,
              borderColor: error ? "#e53e3e" : "#d1d5db",
            }}
          />
          {error && <p style={styles.errorMsg}>パスワードが違います</p>}
          <button type="submit" style={styles.button}>
            入力する
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "40px 32px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 16px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    outline: "none",
    textAlign: "center",
    letterSpacing: "4px",
    transition: "border-color 0.2s",
  },
  errorMsg: {
    color: "#e53e3e",
    fontSize: "13px",
    margin: 0,
  },
  button: {
    marginTop: "4px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
