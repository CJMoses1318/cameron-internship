export const ITEM_DETAILS_API =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails";

/** Used when legacy static links hit `/item-details` without an id */
export const FALLBACK_NFT_ID = 10147817;

export const fetchItemDetails = async (nftId, signal) => {
  const url = `${ITEM_DETAILS_API}?nftId=${encodeURIComponent(nftId)}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};
