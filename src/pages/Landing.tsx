import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { Mission } from "../types";
import { useAuth } from "../context/AuthContext";
import WingMark from "../components/WingMark";
import RopeDivider from "../components/RopeDivider";

export default function Landing() {
  const { user } = useAuth();
  const [previewMissions, setPreviewMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  useEffect(() => {
    // "where" only (no orderBy) so this never needs a Firestore composite
    // index - we sort and slice to 3 client-side instead.
    const q = query(collection(db, "missions"), where("active", "==", true), limit(20));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Mission)
          .sort((a, b) => b.points - a.points)
          .slice(0, 3);
        setPreviewMissions(list);
        setLoadingMissions(false);
      },
      () => setLoadingMissions(false)
    );
    return () => unsub();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-10 text-center md:pt-24">
        <div className="mb-6 flex justify-center">
          <WingMark size={72} />
        </div>
        <p className="mb-3 font-[var(--font-mono)] text-xs tracking-[0.3em] text-(--color-silver)">
          PEGASUS MUAY THAI · כרמיאל
        </p>
        <h1 className="font-[var(--font-display)] text-4xl leading-tight text-(--color-bone) md:text-6xl">
          אליפות פגאסוס
          <br />
          <span className="text-(--color-gold-bright)">תחרות הנקודות השנתית</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-(--color-bone-dim)">
          כל קרב, כל אימון, כל נוקאאוט - הכל נספר. אוהד מעניק נקודות על
          משימות בזירה, ובסוף השנה המתאמן עם הכי הרבה נקודות מטפס למקום
          הראשון.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/leaderboard"
            className="rounded-full bg-(--color-gold) px-6 py-3 font-semibold text-(--color-ink) transition-colors hover:bg-(--color-gold-bright)"
          >
            לוח המובילים
          </Link>
          {!user && (
            <Link
              to="/signup"
              className="rounded-full border border-(--color-silver-dim) px-6 py-3 font-semibold text-(--color-bone) transition-colors hover:border-(--color-gold)"
            >
              הצטרפות לתחרות
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4">
        <RopeDivider />
      </div>

      {/* Prize */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center">
        <div className="tape-corner rounded-2xl border border-(--color-gold-dim) bg-(--color-panel) px-6 py-10">
          <p className="relative z-10 font-[var(--font-mono)] text-xs tracking-[0.3em] text-(--color-gold)">
            הפרס הגדול
          </p>
          <h2 className="relative z-10 mt-3 font-[var(--font-display)] text-3xl text-(--color-bone) md:text-4xl">
            מימון חלקי לכרטיס טיסה לתאילנד
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-lg text-(--color-bone-dim)">
            המתאמן או המתאמנת שיסיימו את השנה במקום הראשון בטבלה יזכו
            בהשתתפות במימון כרטיס הטיסה.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4">
        <RopeDivider />
      </div>

      {/* How points work */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center font-[var(--font-display)] text-2xl text-(--color-bone) md:text-3xl">
          איך צוברים נקודות
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-(--color-bone-dim)">
          כמה דוגמאות מתוך רשימת המשימות - הרשימה המלאה והמעודכנת נמצאת בעמוד
          המשימות.
        </p>

        {!loadingMissions && previewMissions.length === 0 && (
          <p className="mx-auto mt-10 max-w-md text-center text-(--color-bone-dim)">
            אין עדיין משימות בתחרות. הן יתווספו בקרוב.
          </p>
        )}

        {previewMissions.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {previewMissions.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-(--color-panel-border) bg-(--color-panel) p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-[var(--font-display)] text-lg text-(--color-gold-bright)">
                    {m.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-(--color-gold-dim) bg-(--color-ink) px-2.5 py-0.5 font-[var(--font-mono)] text-xs font-bold text-(--color-gold-bright)">
                    +{m.points}
                  </span>
                </div>
                {m.description && (
                  <p className="mt-2 text-sm text-(--color-bone-dim)">
                    {m.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/missions"
            className="text-sm font-semibold text-(--color-silver) underline decoration-(--color-silver-dim) underline-offset-4 hover:text-(--color-gold-bright)"
          >
            לרשימת המשימות המלאה ←
          </Link>
        </div>
      </section>
    </div>
  );
}
