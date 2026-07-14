export function toJsonList(list: string[] | undefined | null): string {
  return JSON.stringify(list ?? []);
}

export function fromJsonList(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}
