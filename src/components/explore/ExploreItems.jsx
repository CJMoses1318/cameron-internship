import React, { useMemo, useState } from "react";
import NftItemCard from "../common/NftItemCard";
import NftItemCardSkeleton from "../common/NftItemCardSkeleton";
import useExploreNfts from "../../hooks/useExploreNfts";

const DEFAULT_VISIBLE_COUNT = 8;
const LOAD_MORE_STEP = 4;
const exploreColumnClass =
  "d-item col-lg-3 col-md-6 col-sm-6 col-xs-12";

const ExploreItems = ({ notice = "" }) => {
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT);
  const { uniqueItems, loading, error } = useExploreNfts({ filter });

  const visibleItems = useMemo(
    () => uniqueItems.slice(0, visibleCount),
    [uniqueItems, visibleCount]
  );

  const canLoadMore = visibleItems.length < uniqueItems.length;

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setVisibleCount(DEFAULT_VISIBLE_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((count) => count + LOAD_MORE_STEP);
  };

  return (
    <>
      {notice && (
        <div className="col-md-12 text-center mb-3">
          <p>{notice}</p>
        </div>
      )}
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {loading &&
        Array.from({ length: DEFAULT_VISIBLE_COUNT }, (_, index) => (
          <NftItemCardSkeleton
            key={`explore-skeleton-${index}`}
            columnClassName={exploreColumnClass}
            style={{ display: "block", backgroundSize: "cover" }}
          />
        ))}
      {!loading && error && (
        <div className="col-md-12 text-center py-4">
          <p>{error}</p>
        </div>
      )}
      {!loading &&
        !error &&
        visibleItems.map((item) => (
          <NftItemCard
            key={item.id ?? item.nftId}
            item={item}
            columnClassName={exploreColumnClass}
            columnStyle={{ display: "block", backgroundSize: "cover" }}
          />
        ))}
      {!loading && !error && canLoadMore && (
        <div className="col-md-12 text-center">
          <button
            type="button"
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        </div>
      )}
      {!loading && !error && uniqueItems.length === 0 && (
        <div className="col-md-12 text-center py-4">
          <p>No items found.</p>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
