import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים.");
      return;
    }
    setBusy(true);
    try {
      await signup(name.trim(), email.trim(), password);
      navigate("/pending");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        setError("כתובת האימייל הזו כבר רשומה. נסו להתחבר.");
      } else {
        setError("משהו השתבש בהרשמה. נסו שוב.");
      }
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        הצטרפות לתחרות
      </h1>
      <p className="mt-3 text-center text-sm text-(--color-bone-dim)">
        אחרי ההרשמה החשבון שלכם ימתין לאישור של אוהד לפני שהוא יופיע בלוח
        המובילים.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
          שם מלא
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-(--color-panel-border) bg-(--color-panel) px-4 py-2.5 text-(--color-bone) outline-none focus:border-(--color-gold)"
          />
        </label>
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
            minLength={6}
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
          {busy ? "נרשם..." : "הרשמה"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-(--color-bone-dim)">
        כבר יש לכם חשבון?{" "}
        <Link to="/login" className="text-(--color-gold-bright) underline underline-offset-4">
          התחברות
        </Link>
      </p>
    </div>
  );
}
