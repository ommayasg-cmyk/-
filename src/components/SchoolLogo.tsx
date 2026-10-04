import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({ className = '', size = 120 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      className={`shrink-0 drop-shadow-md transition-transform hover:scale-105 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="شعار المدارس الأهلية الخاصة"
    >
      <defs>
        {/* Arc path for top Arabic text */}
        <path
          id="topArc"
          d="M 85 250 A 165 165 0 0 1 415 250"
          fill="none"
        />
        {/* Arc path for bottom English text */}
        <path
          id="bottomArc"
          d="M 75 250 A 175 175 0 0 0 425 250"
          fill="none"
        />
        {/* Radial glow for sun rays */}
        <radialGradient id="sunGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer thick black border */}
      <circle cx="250" cy="250" r="235" fill="#ffffff" stroke="#111827" strokeWidth="22" />

      {/* Inner green ring border */}
      <circle cx="250" cy="250" r="172" fill="#ffffff" stroke="#15803d" strokeWidth="8" />
      <circle cx="250" cy="250" r="162" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />

      {/* Sun rays inside the inner circle */}
      <g stroke="#eab308" strokeWidth="4.5" strokeLinecap="round" opacity="0.95">
        <line x1="250" y1="165" x2="250" y2="105" />
        <line x1="225" y1="170" x2="210" y2="112" />
        <line x1="275" y1="170" x2="290" y2="112" />
        <line x1="200" y1="180" x2="175" y2="125" />
        <line x1="300" y1="180" x2="325" y2="125" />
        <line x1="180" y1="195" x2="145" y2="148" />
        <line x1="320" y1="195" x2="355" y2="148" />
        <line x1="165" y1="215" x2="125" y2="178" />
        <line x1="335" y1="215" x2="375" y2="178" />
        <line x1="158" y1="235" x2="112" y2="215" />
        <line x1="342" y1="235" x2="388" y2="215" />
      </g>

      {/* Open Golden Book */}
      <g transform="translate(185, 135)" fill="#ca8a04" stroke="#854d0e" strokeWidth="3">
        {/* Left page */}
        <path d="M 65 35 Q 35 15, 0 25 L 0 55 Q 35 45, 65 65 Z" fill="#fef9c3" />
        <path d="M 65 35 Q 35 15, 0 25 L 0 30 Q 35 20, 65 40 Z" fill="#eab308" />
        {/* Right page */}
        <path d="M 65 35 Q 95 15, 130 25 L 130 55 Q 95 45, 65 65 Z" fill="#fef9c3" />
        <path d="M 65 35 Q 95 15, 130 25 L 130 30 Q 95 20, 65 40 Z" fill="#eab308" />
        {/* Book Spine */}
        <path d="M 63 35 L 67 35 L 67 68 L 63 68 Z" fill="#ca8a04" />
      </g>

      {/* Globe grid lines */}
      <g fill="none" stroke="#7e22ce" strokeWidth="2.5" opacity="0.45">
        <ellipse cx="250" cy="275" rx="145" ry="95" />
        <ellipse cx="250" cy="275" rx="145" ry="55" />
        <ellipse cx="250" cy="275" rx="80" ry="95" />
        <line x1="105" y1="275" x2="395" y2="275" />
      </g>

      {/* Silhouettes of Teacher and Student in Emerald Green */}
      <g fill="#15803d" stroke="#166534" strokeWidth="1.5">
        {/* Teacher Head & Scarf */}
        <circle cx="218" cy="235" r="17" />
        <path d="M 200 248 Q 218 240, 236 248 Q 230 230, 218 226 Q 206 230, 200 248 Z" />
        {/* Teacher Torso / Robe */}
        <path d="M 202 250 L 234 250 L 246 345 L 194 345 Z" />
        {/* Teacher Backpack */}
        <rect x="198" y="258" width="34" height="42" rx="8" fill="#166534" />
        {/* Teacher Legs */}
        <line x1="210" y1="345" x2="210" y2="368" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />
        <line x1="230" y1="345" x2="230" y2="368" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />

        {/* Student Head */}
        <circle cx="265" cy="275" r="12" />
        {/* Student Torso */}
        <path d="M 252 288 L 278 288 L 282 332 L 250 332 Z" />
        {/* Student Backpack */}
        <rect x="254" y="294" width="22" height="26" rx="5" fill="#166534" />
        {/* Student Legs */}
        <line x1="258" y1="332" x2="258" y2="368" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
        <line x1="274" y1="332" x2="274" y2="368" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Circular Top Arabic Text: المدارس الاهلية الخاصة ذ.م.م */}
      <text fill="#111827" fontSize="33" fontWeight="900" fontFamily="Cairo, Tajawal, sans-serif">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          المدارس الاهلية الخاصة ذ.م.م
        </textPath>
      </text>

      {/* Founded Year Text (Red) */}
      <text x="52" y="260" fill="#dc2626" fontSize="24" fontWeight="900" fontFamily="Cairo, Tajawal, sans-serif">
        1982
      </text>
      <text x="408" y="260" fill="#dc2626" fontSize="24" fontWeight="900" fontFamily="Cairo, Tajawal, sans-serif">
        أسست
      </text>

      {/* Circular Bottom English Text: AL AHLIAH PVT. SCHOOLS */}
      <text fill="#111827" fontSize="27" fontWeight="900" fontFamily="Cairo, sans-serif" letterSpacing="2">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          AL AHLIAH PVT. SCHOOLS
        </textPath>
      </text>
    </svg>
  );
};
