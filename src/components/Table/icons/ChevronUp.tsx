import React from "react";

export const ChevronSolidUp = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="#666"
      width="14"
      height="14"
      className={className}
    >
      <path
        fill="currentColor"
        className="text-sky-600"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.707 7.707a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 0-1.414 0L7.707 7.707a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414"
      />
      
      {/* Down Arrow - sky-300 */}
      <path
        fill="currentColor"
        className="text-sky-300"
        fillRule="evenodd"
        clipRule="evenodd"
        opacity="0.4"
        d="M6.293 11.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414"
      />
    </svg>
  );