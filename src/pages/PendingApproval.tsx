import WingMark from "../components/WingMark";

export default function PendingApproval() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mb-6 flex justify-center opacity-70">
        <WingMark size={56} />
      </div>
      <h1 className="font-[var(--font-display)] text-2xl text-(--color-bone)">
        החשבון שלכם ממתין לאישור
      </h1>
      <p className="mt-4 text-(--color-bone-dim)">
        ההרשמה התקבלה בהצלחה. אוהד צריך לאשר את ההצטרפות שלכם לתחרות לפני
        שתופיעו בלוח המובילים ותוכלו לצבור נקודות. בדקו שוב בקרוב.
      </p>
    </div>
  );
}
