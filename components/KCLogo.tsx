"use client";

export function KCLogo({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 120 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Vertical stem */}
      <rect x="16" y="16" width="18" height="100" rx="4" className="fill-[#b8c4c8] dark:fill-[#2a4a52]" />
      <rect x="18" y="16" width="8" height="100" rx="3" className="fill-[#d0d8dc] dark:fill-[#3a6a72]" opacity="0.6" />

      {/* Lower ribbon sweep */}
      <path d="M30 72 Q50 72 58 82 Q66 92 80 98 L80 106 Q64 100 54 90 Q44 80 30 80 Z" fill="#3A8C98" />
      <path d="M30 78 Q48 78 56 88 Q64 98 78 104 L78 112 Q62 106 52 96 Q42 86 30 86 Z" fill="#E07060" />
      <path d="M30 84 Q46 84 54 94 Q62 104 76 110 L76 118 Q60 112 50 102 Q40 92 30 92 Z" fill="#4BB78F" />

      {/* Upper arm */}
      <path d="M30 62 Q44 62 56 48 Q68 34 82 26 L86 26 Q70 36 58 50 Q46 64 30 68 Z" fill="#3A8C98" />
      <path d="M82 26 L86 26 Q78 20 76 12 L72 8 Q74 18 82 26 Z" fill="#3A8C98" />

      {/* Arrow head */}
      <path d="M72 2 L92 10 L82 28 Z" className="fill-[#e8e0c8] dark:fill-[#e8e0d0]" />
      <path d="M72 2 L82 6 L76 18 L68 14 Z" className="fill-[#f0ead8] dark:fill-[#f5f0e0]" />

      {/* Stem shadow */}
      <rect x="30" y="20" width="4" height="92" rx="2" fill="rgba(0,0,0,0.08)" />
    </svg>
  );
}
