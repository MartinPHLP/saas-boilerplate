export function NavButton({
  onClick,
  variant = "icon",
  title,
  icon,
  children,
}) {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        title={title}
        className="px-4 py-1.5 bg-primary text-secondary text-sm font-medium rounded-md
                   hover:bg-primary-hover transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-neutral-dark focus:ring-offset-2"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 text-primary hover:text-primary hover:bg-neutral rounded-md
                 transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
    </button>
  );
}
