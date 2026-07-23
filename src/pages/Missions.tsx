import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Mission } from "../types";
import RopeDivider from "../components/RopeDivider";

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only "where" here (no orderBy) so this never needs a Firestore
    // composite index - we sort client-side instead.
    const q = query(collection(db, "missions"), where("active", "==", true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Mission)
          .sort((a, b) => b.points - a.points);
        setMissions(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        משימות ונקודות
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-center text-(--color-bone-dim)">
        כך צוברים נקודות בתחרות. אוהד מעדכן ומעניק נקודות אחרי כל קרב או אימון.
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <RopeDivider />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {loading && (
          <p className="text-center text-(--color-bone-dim)">טוען משימות...</p>
        )}
        {!loading && missions.length === 0 && (
          <p className="text-center text-(--color-bone-dim)">
            עוד לא נוספו משימות. אוהד יעדכן בקרוב.
          </p>
        )}
        {missions.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-4"
          >
            <div>
              <h3 className="font-semibold text-(--color-bone)">{m.title}</h3>
              {m.description && (
                <p className="mt-1 text-sm text-(--color-bone-dim)">
                  {m.description}
                </p>
              )}
            </div>
            <div className="shrink-0 rounded-full border border-(--color-gold-dim) bg-(--color-ink) px-3 py-1 font-[var(--font-mono)] text-sm font-bold text-(--color-gold-bright)">
              +{m.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
