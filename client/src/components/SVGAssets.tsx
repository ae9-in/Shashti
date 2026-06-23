/**
 * SVG Assets for Shashti Brand
 * Includes: Lotus, Shield, Mandala, Diya, and other ornamental SVGs
 */

export const LotusIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Lotus petals */}
    <path d="M50 10 Q60 25 55 40 Q50 30 50 10" />
    <path d="M50 10 Q40 25 45 40 Q50 30 50 10" />
    <path d="M75 20 Q80 35 70 45 Q75 35 75 20" />
    <path d="M25 20 Q20 35 30 45 Q25 35 25 20" />
    <path d="M80 40 Q85 50 75 60 Q80 50 80 40" />
    <path d="M20 40 Q15 50 25 60 Q20 50 20 40" />
    <path d="M75 70 Q75 80 60 85 Q70 80 75 70" />
    <path d="M25 70 Q25 80 40 85 Q30 80 25 70" />
    
    {/* Center circle */}
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    
    {/* Inner ring */}
    <circle cx="50" cy="50" r="15" fill="none" />
  </svg>
);

export const ShieldIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 120"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Shield shape */}
    <path d="M50 10 L20 30 L20 60 Q20 90 50 110 Q80 90 80 60 L80 30 Z" />
    
    {/* Vertical line in center */}
    <line x1="50" y1="40" x2="50" y2="85" />
  </svg>
);

export const CrownIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 80"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Crown base */}
    <path d="M10 60 L15 30 L35 45 L50 15 L65 45 L85 30 L90 60 Z" />
    
    {/* Base line */}
    <line x1="10" y1="60" x2="90" y2="60" />
    
    {/* Jewels */}
    <circle cx="35" cy="45" r="3" fill="currentColor" />
    <circle cx="50" cy="15" r="3" fill="currentColor" />
    <circle cx="65" cy="45" r="3" fill="currentColor" />
  </svg>
);

export const MandalaIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.8"
    opacity="0.15"
  >
    {/* Outer circle */}
    <circle cx="100" cy="100" r="95" />
    
    {/* Radiating lines */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * 360) / 12;
      const rad = (angle * Math.PI) / 180;
      const x1 = 100 + 80 * Math.cos(rad);
      const y1 = 100 + 80 * Math.sin(rad);
      const x2 = 100 + 95 * Math.cos(rad);
      const y2 = 100 + 95 * Math.sin(rad);
      return (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
      );
    })}
    
    {/* Inner circles */}
    <circle cx="100" cy="100" r="60" />
    <circle cx="100" cy="100" r="40" />
    <circle cx="100" cy="100" r="20" />
    
    {/* Petal shapes */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * 360) / 8;
      const rad = (angle * Math.PI) / 180;
      const x = 100 + 70 * Math.cos(rad);
      const y = 100 + 70 * Math.sin(rad);
      return (
        <circle key={`petal-${i}`} cx={x} cy={y} r="5" />
      );
    })}
  </svg>
);

export const DiyaFlame = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 60"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    {/* Flame shape */}
    <path d="M20 5 Q15 15 15 25 Q15 35 20 40 Q25 35 25 25 Q25 15 20 5 Z" />
    
    {/* Inner glow */}
    <path d="M20 12 Q18 18 18 25 Q18 32 20 36 Q22 32 22 25 Q22 18 20 12 Z" opacity="0.7" />
  </svg>
);

export const HandshakeIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Left hand */}
    <path d="M15 45 L25 35 L35 40 L40 30 L45 35 L50 25" />
    
    {/* Right hand */}
    <path d="M85 45 L75 35 L65 40 L60 30 L55 35 L50 25" />
    
    {/* Connection */}
    <line x1="45" y1="40" x2="55" y2="40" strokeWidth="3" />
  </svg>
);

export const TruckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 80"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Truck body */}
    <rect x="25" y="25" width="50" height="30" />
    
    {/* Cabin */}
    <rect x="10" y="35" width="15" height="20" />
    
    {/* Wheels */}
    <circle cx="20" cy="60" r="5" />
    <circle cx="70" cy="60" r="5" />
    
    {/* Door */}
    <line x1="10" y1="35" x2="10" y2="55" />
  </svg>
);

export const MapPinIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 140"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Pin */}
    <path d="M50 10 C65 10 75 20 75 35 C75 55 50 130 50 130 C50 130 25 55 25 35 C25 20 35 10 50 10 Z" />
    
    {/* Center dot */}
    <circle cx="50" cy="35" r="6" fill="currentColor" />
  </svg>
);

export const GrowthArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Arrow pointing up-right */}
    <path d="M20 80 L80 20" />
    <path d="M80 20 L70 20 L80 10" />
    
    {/* Growth curve */}
    <path d="M20 60 Q40 50 60 40 Q70 35 80 20" fill="none" />
  </svg>
);

export const ProgressBar = ({ progress = 0, className = "" }: { progress?: number; className?: string }) => (
  <svg
    viewBox="0 0 100 4"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Background */}
    <rect x="0" y="0" width="100" height="4" fill="rgba(201, 162, 39, 0.2)" />
    
    {/* Progress fill */}
    <rect x="0" y="0" width={progress} height="4" fill="currentColor" />
  </svg>
);

export const WaveDivider = ({ 
  position = "bottom", 
  color = "#FBF4E6",
  className = "" 
}: { 
  position?: "top" | "bottom"; 
  color?: string;
  className?: string;
}) => {
  const path = position === "bottom" 
    ? "M0,40 Q25,20 50,40 T100,40 L100,100 L0,100 Z"
    : "M0,0 L100,0 L100,40 Q75,60 50,40 T0,40 Z";

  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path d={path} fill={color} />
    </svg>
  );
};
