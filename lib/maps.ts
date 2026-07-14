/**
 * Google Maps helpers that work without an API key: the `output=embed` iframe
 * endpoint and the standard maps.google.com search URL both work key-free.
 * If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set later, swap these for the JS SDK.
 */
export function mapEmbedUrl(lat: number | null | undefined, lng: number | null | undefined, address: string) {
  if (lat != null && lng != null) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
}

export function mapLinkUrl(lat: number | null | undefined, lng: number | null | undefined, address: string) {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
