let _logoCounter = 0;

export function ASLogo({ className }: { className?: string }) {
  // Generate a unique ID per instance to avoid gradient conflicts
  // when multiple logos exist on the same page
  const gradientId = `as-logo-gradient-${++_logoCounter}`;
  const clipId = `as-logo-clip-${_logoCounter}`;

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      overflow="hidden"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D37A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8962E" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="120" height="120" />
        </clipPath>
      </defs>

      {/* Background */}
      {/* Intentionally removed — SVG is transparent; container provides background */}

      {/* Main Circle */}
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />

      {/* Subtle Hexagon */}
      <polygon
        points="60,20 90,35 90,65 60,80 30,65 30,35"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1"
        opacity="0.15"
      />

      {/* Monogram Text */}
      <text
        x="60"
        y="68"
        fontFamily="Cinzel, serif"
        fontSize="35"
        fill={`url(#${gradientId})`}
        textAnchor="middle"
        letterSpacing="2"
        fontWeight="bold"
      >
        A.S
      </text>

      {/* Roof Line */}
      <path
        d="M45 48 L60 38 L75 48"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
