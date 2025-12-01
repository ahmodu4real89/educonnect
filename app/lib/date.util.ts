export function formatIsoDate(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return "—";
  // Use UTC components to avoid timezone rollovers
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatIsoDateTime(input: string | Date | null | undefined): string {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(d.getTime())) return "—";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
