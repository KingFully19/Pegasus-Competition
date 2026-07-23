import { useState } from "react";
import PendingApprovals from "../components/admin/PendingApprovals";
import TraineesPoints from "../components/admin/TraineesPoints";
import ManageMissions from "../components/admin/ManageMissions";

type Tab = "pending" | "trainees" | "missions";

const tabs: { id: Tab; label: string }[] = [
  { id: "pending", label: "בקשות הצטרפות" },
  { id: "trainees", label: "מתאמנים ונקודות" },
  { id: "missions", label: "ניהול משימות" },
];

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("pending");

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-center font-[var(--font-display)] text-3xl text-(--color-bone)">
        פאנל ניהול
      </h1>
      <p className="mt-2 text-center text-(--color-bone-dim)">
        כאן אוהד מנהל את כל התחרות.
      </p>

      <div className="mt-8 flex justify-center gap-2 border-b border-(--color-panel-border)">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t.id
                ? "border-(--color-gold) text-(--color-gold-bright)"
                : "border-transparent text-(--color-bone-dim) hover:text-(--color-bone)"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "pending" && <PendingApprovals />}
        {tab === "trainees" && <TraineesPoints />}
        {tab === "missions" && <ManageMissions />}
      </div>
    </div>
  );
}
