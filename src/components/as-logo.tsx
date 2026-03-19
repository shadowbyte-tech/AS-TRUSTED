export function ASLogo({ className }: { className?: string }) {
  // Use a fixed ID to avoid hydration mismatch
  const gradientId = 'as-logo-gradient';

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '80px', height: '80px' }}
    >
      {/* Background */}
      <rect width="120" height="120" fill="#0B0B0B"/>

      {/* Metallic Gold Gradient */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D37A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8962E" />
        </linearGradient>
      </defs>

      {/* Main Circle */}
      <circle 
        cx="60" 
        cy="60" 
        r="50" 
        fill="none" 
        stroke={`url(#${gradientId})`} 
        strokeWidth="2"
      />

      {/* Subtle Hexagon (Low opacity for depth) */}
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

      {/* Real Estate Hint (Roof Line) */}
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
