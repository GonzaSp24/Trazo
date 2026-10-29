export function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden className={`text-gold ${className}`}>
      <path
        fill="currentColor"
        d="M8 78c40-22 120-40 210-46 90-6 190-10 280-4 40 3 80 10 96 20 6 4-2 10-14 12-60 6-150 4-230 10-80 6-170 18-240 30-40 6-90 10-100 0-8-8-10-16-2-22z"
      />
      <path fill="currentColor" opacity=".55" d="M30 96c80-14 200-26 330-30 70-2 160 0 200 6-90 4-200 10-300 20-80 8-170 18-230 14z" />
    </svg>
  );
}
