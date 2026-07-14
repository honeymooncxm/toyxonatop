/** Deterministic, dependency-free placeholder images rendered locally as SVG (no external network calls). */
export function placeholderImageUrl(seed: string, width = 1200, height = 800, label?: string) {
  const params = new URLSearchParams({ w: String(width), h: String(height) });
  if (label) params.set("label", label);
  return `/api/placeholder/${encodeURIComponent(seed)}?${params.toString()}`;
}
