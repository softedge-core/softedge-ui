import React from "react";

const IconX: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    className="icon-x"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M6.536 6.464a1 1 0 0 1 1.414 0L9.364 7.88a1 1 0 0 0 1.414 0l1.414-1.415a1 1 0 1 1 1.415 1.415l-1.415 1.414a1 1 0 0 0 0 1.414l1.415 1.414a1 1 0 0 1-1.415 1.415l-1.414-1.415a1 1 0 0 0-1.414 0L7.95 13.536a1 1 0 1 1-1.414-1.415l1.414-1.414a1 1 0 0 0 0-1.414L6.536 7.879a1 1 0 0 1 0-1.415"
      clipRule="evenodd"
    />
  </svg>
);

export default IconX;