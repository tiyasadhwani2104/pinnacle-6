export function formatScore(value: number | null | undefined) {
  if (value == null) return "N/A";
  return `${Math.round(value)} / 100`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function truncateText(value: string, max = 110) {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}
