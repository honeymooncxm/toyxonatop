/**
 * Normalizes a regular YouTube/Vimeo link (the kind anyone copies from the
 * address bar or the Share button) into the embeddable URL our <iframe>
 * video gallery needs. Returns null when the URL isn't a recognized
 * YouTube/Vimeo link, so callers can warn the owner instead of silently
 * storing a broken video.
 */
export function toEmbedUrl(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    const shortsMatch = url.pathname.match(/^\/shorts\/([^/]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    const embedMatch = url.pathname.match(/^\/embed\/([^/]+)/);
    if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
    return null;
  }

  if (host === "vimeo.com") {
    const id = url.pathname.match(/^\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") {
    return url.href;
  }

  return null;
}

export function isSupportedVideoUrl(input: string): boolean {
  return toEmbedUrl(input) !== null;
}
