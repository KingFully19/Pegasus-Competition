import { useEffect, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { Mission } from "../../types";

export default function ManageMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "missions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setMissions(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Mission));
    });
    return () => unsub();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPoints("");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pointsNum = Number(points);
    if (!title.trim() || !pointsNum) return;
    setBusy(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, "missions", editingId), {
          title: title.trim(),
          description: description.trim(),
          points: pointsNum,
        });
      } else {
        await addDoc(collection(db, "missions"), {
          title: title.trim(),
          description: description.trim(),
          points: pointsNum,
          active: true,
          createdAt: Date.now(),
        });
      }
      resetForm();
    } finally {
      setBusy(false);
    }
  }

  function startEdit(m: Mission) {
    setEditingId(m.id);
    setTitle(m.title);
    setDescription(m.description);
    setPoints(String(m.points));
  }

  async function toggleActive(m: Mission) {
    await updateDoc(doc(db, "missions", m.id), { active: !m.active });
  }

  async function remove(m: Mission) {
    if (!confirm(`למחוק לצמיתות את המשימה "${m.title}"?`)) return;
    await deleteDoc(doc(db, "missions", m.id));
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-(--color-gold-dim) bg-(--color-panel-raised) p-5"
      >
        <h3 className="font-[var(--font-display)] text-lg text-(--color-gold-bright)">
          {editingId ? "עריכת משימה" : "משימה חדשה"}
        </h3>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
            כותרת
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: ניצחון בנוקאאוט עם מכה לכבד"
              className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
            נקודות
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="10"
              className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
          תיאור (אופציונלי)
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="פירוט קצר של הקריטריון"
            className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-(--color-gold) px-5 py-2 text-sm font-semibold text-(--color-ink) hover:bg-(--color-gold-bright) disabled:opacity-50"
          >
            {editingId ? "שמירת שינויים" : "יצירת משימה"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-(--color-panel-border) px-5 py-2 text-sm text-(--color-bone-dim)"
            >
              ביטול עריכה
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-col gap-2.5">
        {missions.length === 0 && (
          <p className="rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-6 text-center text-(--color-bone-dim)">
            עדיין לא נוצרו משימות. הוסיפו את הראשונה למעלה.
          </p>
        )}
        {missions.map((m) => (
          <div
            key={m.id}
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4 ${
              m.active
                ? "border-(--color-panel-border) bg-(--color-panel)"
                : "border-(--color-panel-border) bg-(--color-panel) opacity-50"
            }`}
          >
            <div>
              <p className="font-semibold text-(--color-bone)">
                {m.title}{" "}
                {!m.active && (
                  <span className="text-xs text-(--color-bone-dim)">(מושבתת)</span>
                )}
              </p>
              {m.description && (
                <p className="text-sm text-(--color-bone-dim)">{m.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-[var(--font-mono)] font-bold text-(--color-gold-bright)">
                +{m.points}
              </span>
              <button
                onClick={() => startEdit(m)}
                className="rounded-full border border-(--color-panel-border) px-3 py-1 text-xs text-(--color-bone-dim) hover:border-(--color-gold) hover:text-(--color-gold-bright)"
              >
                עריכה
              </button>
              <button
                onClick={() => toggleActive(m)}
                className="rounded-full border border-(--color-panel-border) px-3 py-1 text-xs text-(--color-bone-dim) hover:border-(--color-silver)"
              >
                {m.active ? "השבתה" : "הפעלה"}
              </button>
              <button
                onClick={() => remove(m)}
                className="rounded-full border border-(--color-panel-border) px-3 py-1 text-xs text-(--color-bone-dim) hover:border-(--color-blood) hover:text-(--color-blood)"
              >
                מחיקה
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
