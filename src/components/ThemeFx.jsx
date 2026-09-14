import { useMemo } from 'react';

/**
 * Ambient particles for the home hero (snow, petals, hearts, ...).
 *
 * Takes a recipe like [{ type: 'snow', n: 60 }] and renders that many <i>
 * elements with randomized CSS variables. All motion is CSS keyframes in
 * home-themes.css, so this costs nothing after mount. Hidden entirely under
 * prefers-reduced-motion.
 */

const r = (a, b) => a + Math.random() * (b - a);
const CONFETTI = ['#E0BC63', '#F4E2A6', '#F6EFE4', '#B89446'];
const SPARK = ['#E8264A', '#FFFFFF', '#5C7CFF'];

const SIZE = {
  snow: [2, 5], petal: [10, 18], heart: [8, 16], ember: [3, 7], star: [6, 14],
  spark: [90, 220], bubble: [5, 14], confetti: [6, 11], pin: [8, 8], bat: [26, 26],
};
const DUR = {
  snow: [9, 18], petal: [10, 18], heart: [9, 16], ember: [6, 12], star: [2, 5],
  spark: [4, 7], bubble: [7, 14], confetti: [8, 14], bat: [5, 9], pin: [2, 4],
};

function particle(type, k) {
  const [w0, w1] = SIZE[type] || [6, 6];
  const [d0, d1] = DUR[type] || [8, 8];
  const style = {
    '--x': `${r(0, 100)}%`,
    '--y': `${r(5, 70)}%`,
    '--delay': `${-r(0, 14)}s`,
    '--dx': `${r(-60, 60)}px`,
    '--dy': `${r(-30, 30)}px`,
    '--rot': `${r(-360, 360)}deg`,
    '--s': r(0.5, 1.2),
    '--o': r(0.35, 0.9),
    '--w': `${r(w0, w1)}px`,
    '--d': `${r(d0, d1)}s`,
  };
  if (type === 'confetti') style['--c'] = CONFETTI[k % CONFETTI.length];
  if (type === 'spark') style['--c'] = SPARK[k % SPARK.length];
  return style;
}

export default function ThemeFx({ recipe }) {
  // Regenerate only when the recipe changes (i.e. the theme changes).
  const items = useMemo(() => {
    const out = [];
    (recipe || []).forEach(({ type, n }) => {
      for (let k = 0; k < n; k++) out.push({ type, style: particle(type, k), id: `${type}-${k}` });
    });
    return out;
  }, [recipe]);

  if (items.length === 0) return null;

  return (
    <div className="fx" aria-hidden="true">
      {items.map((p) => (
        <i key={p.id} className={p.type} style={p.style} />
      ))}
    </div>
  );
}