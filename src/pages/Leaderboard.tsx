import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { TraineeProfile } from "../types";
import WingMark from "../components/WingMark";
import RopeDivider from "../components/RopeDivider";

export default function Leaderboard() {
  const [trainees, setTrainees] = useState<TraineeProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only "where" here (no orderBy) so this never needs a Firestore
    // composite index - we sort client-side instead. Ohad's own admin
    // account never shows up on the leaderboard.
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => d.data() as TraineeProfile)
          .filter((t) => t.role !== "admin")
          .sort((a, b) => b.totalPoints - a.totalPoints);
        setTrainees(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        לוח המובילים
      </h1>
      <p className="mt-3 text-center text-(--color-bone-dim)">
        הדירוג מתעדכן בזמן אמת עם כל נקודה שאוהד מעניק.
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <RopeDivider />
      </div>

      <div className="mt-8 flex flex-col gap-2.5">
        {loading && (
          <p className="text-center text-(--color-bone-dim)">טוען דירוג...</p>
        )}
        {!loading && trainees.length === 0 && (
          <p className="text-center text-(--color-bone-dim)">
            עדיין אין מתאמנים מאושרים בלוח. חכו לאישור של אוהד.
          </p>
        )}
        {trainees.map((t, i) => {
          const rank = i + 1;
          const isFirst = rank === 1;
          return (
            <div
              key={t.uid}
              className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${
                isFirst
                  ? "border-(--color-gold) bg-(--color-panel-raised)"
                  : "border-(--color-panel-border) bg-(--color-panel)"
              }`}
            >
              <div className="flex w-10 shrink-0 items-center justify-center">
                {isFirst ? (
                  <WingMark size={34} />
                ) : (
                  <span className="font-[var(--font-mono)] text-lg text-(--color-silver)">
                    {rank}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    isFirst ? "text-(--color-gold-bright)" : "text-(--color-bone)"
                  }`}
                >
                  {t.name}
                </p>
              </div>
              <div className="shrink-0 font-[var(--font-mono)] text-lg font-bold text-(--color-bone)">
                {t.totalPoints}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
