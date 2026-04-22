/** @param {string} [name] */
export function formatAuthorHandle(name) {
  if (!name || typeof name !== "string") {
    return "@creator";
  }
  const slug = name
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 18);
  return `@${slug || "creator"}`;
}

/**
 * When an author is not in the top sellers list but has NFTs from explore,
 * build a minimal profile for display (explore items may omit authorName).
 * @param {string|number} authorId
 * @param {Array<{ authorName?: string, authorImage?: string, price?: number }>} items
 */
export function buildAuthorProfileFromNfts(authorId, items) {
  if (!items?.length) return null;
  const first = items[0];
  const prices = items
    .map((i) => Number(i.price))
    .filter((n) => Number.isFinite(n));
  const avgPrice =
    prices.length > 0
      ? Number(
          (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
        )
      : 0;
  const rawName =
    typeof first.authorName === "string" ? first.authorName.trim() : "";
  return {
    authorId: Number(authorId),
    authorName: rawName || "Creator",
    authorImage: first.authorImage || "",
    price: avgPrice,
  };
}

/** Deterministic pseudo-address for display (not on-chain). */
export function formatPseudoWallet(authorId) {
  const n = Math.floor(Number(authorId));
  if (!Number.isFinite(n) || n < 0) {
    return `0x${"0".repeat(40)}`;
  }
  let hex = n.toString(16);
  while (hex.length < 40) {
    hex = `0${hex}`;
  }
  return `0x${hex.slice(0, 40)}`;
}
