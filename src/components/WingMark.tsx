interface WingMarkProps {
  size?: number;
  className?: string;
}

/**
 * The site's emblem - used in the navbar, hero, and to crown the #1 spot
 * on the leaderboard.
 *
 * TO USE YOUR OWN ICON:
 * 1. Put your image file in the `public/` folder, named `emblem.png`
 *    (any square-ish image works; transparent background looks best).
 * 2. That's it - this component and the browser-tab favicon (set in
 *    index.html) both point at that same file.
 * If you'd rather use a different filename or an .svg, just change the
 * "emblem.png" path below to match, and update the equivalent line in
 * index.html too.
 */
export default function WingMark({ size = 40, className = "" }: WingMarkProps) {
  return (
    <img
      src="/Pegasus-Competition/emblem.png"
      alt="פגאסוס"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`inline-block rounded-full object-cover ${className}`}
    />
  );
}
