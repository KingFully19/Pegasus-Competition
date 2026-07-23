import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import type { Mission, TraineeProfile } from "../../types";

export default function TraineesPoints() {
  const { profile: adminProfile } = useAuth();
  const [trainees, setTrainees] = useState<TraineeProfile[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [openUid, setOpenUid] = useState<string | null>(null);
  const [missionId, setMissionId] = useState("");
  const [customPoints, setCustomPoints] = useState<string>("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => d.data() as TraineeProfile)
        .filter((t) => t.role !== "admin")
        .sort((a, b) => b.totalPoints - a.totalPoints);
      setTrainees(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "missions"), where("active", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Mission)
        .sort((a, b) => a.title.localeCompare(b.title, "he"));
      setMissions(list);
    });
    return () => unsub();
  }, []);

  function openAward(uid: string) {
    setOpenUid(uid);
    setMissionId(missions[0]?.id ?? "");
    setCustomPoints("");
    setNote("");
  }

  async function submitAward(t: TraineeProfile) {
    const mission = missions.find((m) => m.id === missionId);
    const points = customPoints !== "" ? Number(customPoints) : mission?.points;
    if (!points || Number.isNaN(points)) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "awards"), {
        userId: t.uid,
        userName: t.name,
        missionId: mission?.id ?? "custom",
        missionTitle: mission?.title ?? "נקודות בונוס",
        points,
        note: note.trim() || null,
        awardedAt: Date.now(),
        awardedBy: adminProfile?.name ?? "אוהד",
      });
      await updateDoc(doc(db, "users", t.uid), {
        totalPoints: increment(points),
      });
      setOpenUid(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {trainees.length === 0 && (
        <p className="rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-6 text-center text-(--color-bone-dim)">
          אין עדיין מתאמנים מאושרים.
        </p>
      )}
      {trainees.map((t) => (
        <div
          key={t.uid}
          className="rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-(--color-bone)">{t.name}</p>
              <p className="text-sm text-(--color-bone-dim)">{t.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-[var(--font-mono)] text-lg font-bold text-(--color-gold-bright)">
                {t.totalPoints}
              </span>
              <button
                onClick={() => openAward(t.uid)}
                className="rounded-full bg-(--color-gold) px-4 py-1.5 text-sm font-semibold text-(--color-ink) hover:bg-(--color-gold-bright)"
              >
                הענקת נקודות
              </button>
            </div>
          </div>

          {openUid === t.uid && (
            <div className="mt-4 flex flex-col gap-3 border-t border-(--color-panel-border) pt-4">
              <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
                משימה
                <select
                  value={missionId}
                  onChange={(e) => setMissionId(e.target.value)}
                  className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
                >
                  <option value="">בחירת משימה (אופציונלי)</option>
                  {missions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} (+{m.points})
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
                נקודות מותאמות (השאירו ריק כדי להשתמש בניקוד המשימה)
                <input
                  type="number"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  placeholder="למשל: 5"
                  className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-(--color-bone-dim)">
                הערה (אופציונלי)
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="למשל: קרב נגד ג'ים דן, 12.10"
                  className="rounded-lg border border-(--color-panel-border) bg-(--color-ink) px-3 py-2 text-(--color-bone) outline-none focus:border-(--color-gold)"
                />
              </label>
              <div className="flex gap-2">
                <button
                  disabled={busy || (!missionId && customPoints === "")}
                  onClick={() => submitAward(t)}
                  className="rounded-full bg-(--color-gold) px-5 py-2 text-sm font-semibold text-(--color-ink) hover:bg-(--color-gold-bright) disabled:opacity-50"
                >
                  {busy ? "שומר..." : "אישור והענקה"}
                </button>
                <button
                  onClick={() => setOpenUid(null)}
                  className="rounded-full border border-(--color-panel-border) px-5 py-2 text-sm text-(--color-bone-dim)"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
