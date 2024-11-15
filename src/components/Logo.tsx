import React from 'react';

export default function Logo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      
      {/* First Wave */}
      <path
        d="M40,100 Q70,60 100,100 T160,100"
        fill="none"
        stroke="url(#waveGradient1)"
        strokeWidth="12"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          dur="3s"
          repeatCount="indefinite"
          values="
            M40,100 Q70,60 100,100 T160,100;
            M40,100 Q70,140 100,100 T160,100;
            M40,100 Q70,60 100,100 T160,100
          "
        />
      </path>
      
      {/* Second Wave */}
      <path
        d="M40,120 Q70,80 100,120 T160,120"
        fill="none"
        stroke="url(#waveGradient2)"
        strokeWidth="12"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          dur="3s"
          repeatCount="indefinite"
          values="
            M40,120 Q70,80 100,120 T160,120;
            M40,120 Q70,160 100,120 T160,120;
            M40,120 Q70,80 100,120 T160,120
          "
        />
      </path>
    </svg>
  );
}