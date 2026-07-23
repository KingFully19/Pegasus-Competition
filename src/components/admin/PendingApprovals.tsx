import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { TraineeProfile } from "../../types";

export default function PendingApprovals() {
  const [pending, setPending] = useState<TraineeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUid, setBusyUid] = useState<string | null>(null);

  useEffect(() => {
    // Only "where" here (no orderBy) so this never needs a Firestore
    // composite index - we sort client-side instead.
    const q = query(collection(db, "users"), where("status", "==", "pending"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => d.data() as TraineeProfile)
          .sort((a, b) => a.createdAt - b.createdAt);
        setPending(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  async function approve(uid: string) {
    setBusyUid(uid);
    try {
      await updateDoc(doc(db, "users", uid), { status: "approved" });
    } finally {
      setBusyUid(null);
    }
  }

  async function reject(uid: string) {
    if (!confirm("למחוק את הבקשה הזו? המתאמן יצטרך להירשם מחדש.")) return;
    setBusyUid(uid);
    try {
      await deleteDoc(doc(db, "users", uid));
    } finally {
      setBusyUid(null);
    }
  }

  if (loading) {
    return <p className="text-(--color-bone-dim)">טוען בקשות...</p>;
  }

  if (pending.length === 0) {
    return (
      <p className="rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-6 text-center text-(--color-bone-dim)">
        אין בקשות הצטרפות ממתינות כרגע.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pending.map((p) => (
        <div
          key={p.uid}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--color-panel-border) bg-(--color-panel) px-5 py-4"
        >
          <div>
            <p className="font-semibold text-(--color-bone)">{p.name}</p>
            <p className="text-sm text-(--color-bone-dim)">{p.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              disabled={busyUid === p.uid}
              onClick={() => approve(p.uid)}
              className="rounded-full bg-(--color-gold) px-4 py-1.5 text-sm font-semibold text-(--color-ink) hover:bg-(--color-gold-bright) disabled:opacity-60"
            >
              אישור
            </button>
            <button
              disabled={busyUid === p.uid}
              onClick={() => reject(p.uid)}
              className="rounded-full border border-(--color-panel-border) px-4 py-1.5 text-sm text-(--color-bone-dim) hover:border-(--color-blood) hover:text-(--color-blood) disabled:opacity-60"
            >
              דחייה
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
