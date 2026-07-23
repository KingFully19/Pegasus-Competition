import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("אימייל או סיסמה שגויים. נסו שוב.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        התחברות
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
          אימייל
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-(--color-panel-border) bg-(--color-panel) px-4 py-2.5 text-(--color-bone) outline-none focus:border-(--color-gold)"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
          סיסמה
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-(--color-panel-border) bg-(--color-panel) px-4 py-2.5 text-(--color-bone) outline-none focus:border-(--color-gold)"
          />
        </label>
        {error && <p className="text-sm text-(--color-blood)">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 rounded-full bg-(--color-gold) px-6 py-3 font-semibold text-(--color-ink) transition-colors hover:bg-(--color-gold-bright) disabled:opacity-60"
        >
          {busy ? "מתחבר..." : "התחברות"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-(--color-bone-dim)">
        עוד לא רשומים?{" "}
        <Link to="/signup" className="text-(--color-gold-bright) underline underline-offset-4">
          הצטרפו לתחרות
        </Link>
      </p>
    </div>
  );
}
