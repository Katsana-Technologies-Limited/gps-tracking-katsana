export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

export const formatDue = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const utcDate = new Date(dateStr);
  if (Number.isNaN(utcDate.getTime())) return dateStr;
  const dhakaOffset = 6 * 60;
  const localDate = new Date(utcDate.getTime() + dhakaOffset * 60 * 1000);
  return localDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
