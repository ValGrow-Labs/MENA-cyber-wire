/**
 * Illustrative photography per story category (Unsplash, free licence).
 * Every ID here was checked to load and to match its category by eye.
 * Stories without their own photo get one of these, assigned so that
 * no photo is used twice in the feed (see assignUniqueImages).
 */
const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

const POOLS: Record<string, string[]> = {
  Vulnerability: [
    "1515879218367-8466d910aaa4", "1461749280684-dccba630e2f6", "1607799279861-4dd421887fb3", "1624953587687-daf255b6b80a",
    "1542831371-29b0f74f9713", "1555066931-4365d14bab8c", "1629654297299-c8506221ca97", "1555949963-ff9fe0c870eb",
    "1504639725590-34d0984388bd", "1518770660439-4636190af475",
  ],
  Ransomware: ["1633265486064-086b219458ec", "1614064641938-3bbee52942c7", "1526374965328-7f61d4dc18c5", "1510511459019-5dda7724fd87"],
  "Data Breach": [
    "1558494949-ef010cbdcc31", "1597852074816-d933c7d2b988", "1520869562399-e772f042f422", "1606765962248-7ff407b51667",
    "1562813733-b31f71025d54", "1544383835-bda2bc66a55d", "1531297484001-80022131f5a1",
  ],
  "Critical Infrastructure": [
    "1513828583688-c52646db42da", "1578575437130-527eed3abbec", "1509391366360-2e959784a276", "1466611653911-95081537e5b7",
    "1497435334941-8c899ee9e8e9", "1558346490-a72e53ae2d4f",
  ],
  "Espionage & APT": [
    "1639762681485-074b7f938ba0", "1625014618427-fbc980b974f5", "1605810230434-7631ac76ec81", "1488229297570-58520851e868",
    "1639322537228-f710d846310a", "1523961131990-5ea7c61b2107",
  ],
  "Policy & Regulation": [
    "1504711434969-e33886168f5c", "1546412414-8035e1776c9a", "1580674684081-7617fbf3d745", "1450101499163-c8848c66ca85",
    "1486406146926-c627a92ad1ab", "1508385082359-f38ae991e8f2", "1539650116574-8efeb43e2750", "1489493585363-d69421e0edd3",
  ],
  "Fintech & Banking": [
    "1551288049-bebda4e38f71", "1460925895917-afdab827c52f", "1526628953301-3e589a6a8b74", "1611974789855-9c2a0a7236a3",
    "1550565118-3a14e8d0386f", "1560472355-536de3962603", "1563013544-824ae1b704d3", "1518186285589-2f7649de83e0",
  ],
  "Cloud & AI": ["1677442136019-21780ecad995", "1620712943543-bcc4688e7485", "1597733336794-12d05021d510"],
};

const ALL = Array.from(new Set(Object.values(POOLS).flat()));

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const photoId = (url?: string) => url?.match(/photo-([\w-]+?)(\?|$)/)?.[1];

/** Stable illustrative image for a single story (used only as a last-resort fallback). */
export function categoryImage(category: string, seed: string, width = 1200): string {
  const pool = POOLS[category] || ALL;
  return u(pool[hash(seed) % pool.length], width);
}

/**
 * Give every story without a photo its own illustrative photo, never repeating one
 * already used by another story in the list. Category match first, then any unused photo.
 */
export function assignUniqueImages<T extends { id: string; category: string; imageUrl?: string }>(items: T[]): T[] {
  const used = new Set(items.map((a) => photoId(a.imageUrl)).filter(Boolean) as string[]);
  return items.map((a) => {
    if (a.imageUrl) return a;
    const pool = POOLS[a.category] || [];
    const start = hash(a.id);
    const rotated = [...pool.slice(start % (pool.length || 1)), ...pool.slice(0, start % (pool.length || 1))];
    const pick = rotated.find((id) => !used.has(id)) || ALL.find((id) => !used.has(id));
    if (!pick) return a; // library exhausted: StoryCover falls back to a category photo
    used.add(pick);
    return { ...a, imageUrl: u(pick) };
  });
}

export const REGION_IMAGES = {
  gulfSkyline: u("1512453979798-5ea266f8880c", 1600),
  riyadh: u("1586724237569-f3d0c1dee8c6", 1600),
};

/**
 * A curated, full-quality photo for a large slot (e.g. the lead story), matched to the
 * category and never one already used by another story in the list.
 */
export function pickUnusedPhoto(category: string, items: { imageUrl?: string }[], seed = "", width = 1600): string | undefined {
  const used = new Set(items.map((a) => photoId(a.imageUrl)).filter(Boolean) as string[]);
  const pool = POOLS[category] || [];
  const start = hash(seed) % (pool.length || 1);
  const rotated = [...pool.slice(start), ...pool.slice(0, start)];
  const pick = rotated.find((id) => !used.has(id)) || ALL.find((id) => !used.has(id));
  return pick ? u(pick, width) : undefined;
}
