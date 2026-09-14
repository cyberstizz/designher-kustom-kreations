/**
 * A small evergreen swag draped over the wordmark for the Christmas theme.
 * Pure SVG: a pine swag with needle texture, holly berries, and a string of
 * twinkling lights (animated in home-themes.css). Positioned by .garland.
 */
const SWAG = 'M0 6 Q 70 26 140 6';

const BERRIES = [
  [21, 11.1], [42, 14.4], [72, 17.2], [98, 14.4], [119, 11.1],
];
const LIGHTS = [
  [11.2, 8.9, '#F0D890'], [30.8, 12.9, '#E0203F'], [53.2, 15.4, '#F0D890'],
  [70, 16.6, '#F6EFE4'], [86.8, 15.4, '#E0203F'], [109.2, 12.9, '#F0D890'],
  [128.8, 8.9, '#E0203F'],
];

export default function Garland() {
  return (
    <svg className="garland" viewBox="0 0 140 24" aria-hidden="true" focusable="false">
      {/* pine body */}
      <path d={SWAG} fill="none" stroke="#1E5B3A" strokeWidth="5" strokeLinecap="round" />
      {/* needle texture, two dashed passes */}
      <path d={SWAG} fill="none" stroke="#2F8A55" strokeWidth="8" strokeLinecap="butt" strokeDasharray="1 3" opacity=".9" />
      <path d={SWAG} fill="none" stroke="#6FBF8A" strokeWidth="6" strokeLinecap="butt" strokeDasharray="1 5" strokeDashoffset="2" opacity=".6" />
      {/* light wire */}
      <path d={SWAG} fill="none" stroke="rgba(246,239,228,.35)" strokeWidth=".6" strokeDasharray="2 2" />
      {/* holly berries */}
      {BERRIES.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.9" fill="#B0142F" />
          <circle cx={x - 0.6} cy={y - 0.6} r=".55" fill="#F6EFE4" opacity=".8" />
        </g>
      ))}
      {/* lights */}
      {LIGHTS.map(([x, y, c], i) => (
        <g key={i} className="light">
          <circle cx={x} cy={y + 1.4} r="2.6" fill={c} opacity=".35" />
          <circle cx={x} cy={y + 1.4} r="1.3" fill={c} />
        </g>
      ))}
      {/* bows at each end */}
      <g fill="#B0142F">
        <path d="M0 6 l-4 -3 l1 3 l-1 3 z" />
        <path d="M0 6 l4 -3 l-1 3 l1 3 z" />
        <circle cx="0" cy="6" r="1.3" fill="#E0203F" />
        <path d="M140 6 l-4 -3 l1 3 l-1 3 z" />
        <path d="M140 6 l4 -3 l-1 3 l1 3 z" />
        <circle cx="140" cy="6" r="1.3" fill="#E0203F" />
      </g>
    </svg>
  );
}