import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Award } from "../types";
import { useAuth } from "../context/AuthContext";
import RopeDivider from "../components/RopeDivider";

export default function Profile() {
  const { profile } = useAuth();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    // Only "where" here (no orderBy) so this never needs a Firestore
    // composite index - we sort client-side instead.
    const q = query(collection(db, "awards"), where("userId", "==", profile.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Award)
          .sort((a, b) => b.awardedAt - a.awardedAt);
        setAwards(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        {profile.name}
      </h1>

      {profile.status === "pending" && (
        <p className="mx-auto mt-4 max-w-md rounded-lg border border-(--color-gold-dim) bg-(--color-panel) px-4 py-3 text-center text-sm text-(--color-gold-bright)">
          החשבון שלכם עדיין ממתין לאישור של אוהד ולא מופיע בלוח המובילים.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-(--color-gold-dim) bg-(--color-panel-raised) py-8 text-center">
        <p className="font-[var(--font-mono)] text-xs tracking-[0.3em] text-(--color-silver)">
          סה״כ נקודות
        </p>
        <p className="mt-2 font-[var(--font-mono)] text-5xl font-bold text-(--color-gold-bright)">
          {profile.totalPoints}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md">
        <RopeDivider />
      </div>

      <h2 className="mt-10 text-center font-[var(--font-display)] text-xl text-(--color-bone)">
        היסטוריית נקודות
      </h2>
      <div className="mt-6 flex flex-col gap-2.5">
        {loading && (
          <p className="text-center text-(--color-bone-dim)">טוען היסטוריה...</p>
        )}
        {!loading && awards.length === 0 && (
          <p className="text-center text-(--color-bone-dim)">
            עדיין לא הוענקו לכם נקודות. יאללה, לזירה.
          </p>
        )}
        {awards.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-4"
          >
            <div>
              <p className="font-semibold text-(--color-bone)">{a.missionTitle}</p>
              {a.note && (
                <p className="mt-1 text-sm text-(--color-bone-dim)">{a.note}</p>
              )}
              <p className="mt-1 font-[var(--font-mono)] text-xs text-(--color-silver-dim)">
                {new Date(a.awardedAt).toLocaleDateString("he-IL")}
              </p>
            </div>
            <div className="shrink-0 font-[var(--font-mono)] text-lg font-bold text-(--color-gold-bright)">
              +{a.points}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
