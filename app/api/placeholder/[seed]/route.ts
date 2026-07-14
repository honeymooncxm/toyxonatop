import { NextRequest } from "next/server";

const PALETTES: [string, string][] = [
  ["#d9b871", "#8a6a2f"],
  ["#e3c68c", "#755920"],
  ["#c9a15b", "#4a3a18"],
  ["#efdcae", "#977325"],
  ["#d4af6a", "#57431d"],
  ["#cbb27a", "#3f3116"],
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initials(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ seed: string }> }) {
  const { seed } = await params;
  const sp = req.nextUrl.searchParams;
  const width = Number(sp.get("w") ?? 800);
  const height = Number(sp.get("h") ?? 600);
  const label = sp.get("label") ?? "";

  const hash = hashString(seed);
  const [c1, c2] = PALETTES[hash % PALETTES.length];
  const angle = hash % 360;
  const text = initials(label || seed);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  <circle cx="${width * 0.82}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.28}" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="${width * 0.12}" cy="${height * 0.85}" r="${Math.min(width, height) * 0.22}" fill="#000000" fill-opacity="0.08"/>
  ${text ? `<text x="50%" y="52%" font-family="Georgia, serif" font-size="${Math.min(width, height) * 0.16}" fill="#ffffff" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle">${text}</text>` : ""}
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
