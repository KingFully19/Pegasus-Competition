interface WingMarkProps {
  size?: number;
  className?: string;
}

/** The site's signature emblem: a circular seal with a stylized Pegasus wing,
 * echoing a championship belt medallion. Used in the navbar, hero, and to
 * crown the #1 spot on the leaderboard. */
export default function WingMark({ size = 40, className = "" }: WingMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="var(--color-panel)"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--color-silver-dim)"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M50 78 C 42 62, 20 58, 12 34 C 24 40, 34 40, 42 32 C 36 46, 40 54, 50 62 C 60 54, 64 46, 58 32 C 66 40, 76 40, 88 34 C 80 58, 58 62, 50 78 Z"
        fill="var(--color-gold-bright)"
      />
    </svg>
  );
}
