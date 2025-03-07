import React from "react";

export function NavButton({
  onClick,
  variant = "icon",
  title,
  icon,
  children,
  isActive = false,
}) {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        title={title}
        className="px-4 py-2 bg-colora text-white text-sm font-medium rounded-md
                   hover:bg-colorb transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-colora/50 focus:ring-offset-2"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        p-2 flex items-center gap-2 w-full rounded-md
        text-sm font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-colora/50 focus:ring-offset-2
        ${
          isActive
            ? "text-colora bg-colora/10 border-l-4 border-colora pl-[6px]"
            : "text-colord hover:bg-colorc border-l-4 border-transparent pl-[6px]"
        }
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
      {children && <span>{children}</span>}
    </button>
  );
}
