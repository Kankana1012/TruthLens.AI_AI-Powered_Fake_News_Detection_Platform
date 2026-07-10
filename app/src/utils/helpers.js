export function formatDateTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function truncate(str, n = 60) {
  if (!str) return "";
  return str.length > n ? `${str.slice(0, n)}...` : str;
}

export function seedInitialHistory(existingCount) {
  return existingCount;
}
