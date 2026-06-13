import React from 'react';

export default function Logo({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {/* Sleek multi-layered isometric bracket representing environment isolation */}
      <path
        d="M16 2.5L28 9.5V22.5L16 29.5L4 22.5V9.5L16 2.5Z"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
        className="opacity-90"
      />
      <path
        d="M16 8.5L24.5 13.5V23.5L16 28.5L7.5 23.5V13.5L16 8.5Z"
        fill="url(#logo-grad)"
        className="opacity-10"
      />
      {/* Sync vault logic center */}
      <path
        d="M16 9.5V22.5"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 14L16 9.5L20.5 14"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="22.5" r="2.5" fill="url(#logo-grad)" />
    </svg>
  );
}
