import React from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorImage from "../images/author_thumbnail.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import { useTopSellers } from "../hooks/useTopSellers";
import { useAuthorNfts } from "../hooks/useAuthorNfts";
import ImageWithFallback from "../components/UI/ImageWithFallback";
import {
  buildAuthorProfileFromNfts,
  formatAuthorHandle,
  formatPseudoWallet,
} from "../utils/authorDisplay";

const Author = () => {
  useScrollRestoration();
  const { authorId } = useParams();
  const { sellers, loading, error } = useTopSellers();
  const { items: nftItems, loading: nftsLoading, error: nftsError } =
    useAuthorNfts(authorId);

  const seller =
    authorId != null
      ? sellers.find((s) => String(s.authorId) === String(authorId))
      : null;

  const fallbackAuthor =
    !seller &&
    authorId != null &&
    !nftsLoading &&
    !nftsError &&
    nftItems.length > 0
      ? buildAuthorProfileFromNfts(authorId, nftItems)
      : null;

  const resolvedAuthor = seller || fallbackAuthor;

  const showLoadingProfile =
    authorId != null &&
    !error &&
    (loading || (!seller && !loading && nftsLoading));

  const showNotFound =
    authorId != null &&
    !loading &&
    !error &&
    !nftsLoading &&
    !nftsError &&
    !seller &&
    nftItems.length === 0;

  const showExploreError =
    authorId != null &&
    !loading &&
    !error &&
    !seller &&
    !nftsLoading &&
    Boolean(nftsError);

  const showProfile =
    authorId != null &&
    Boolean(resolvedAuthor) &&
    !loading &&
    (seller ? true : !nftsLoading);

  const showNoId = authorId == null;

  const profileUsername = resolvedAuthor
    ? formatAuthorHandle(resolvedAuthor.authorName)
    : "";
  const profileWallet =
    authorId != null ? formatPseudoWallet(authorId) : "";
  const likesSum = nftItems.reduce((s, i) => s + (Number(i.likes) || 0), 0);
  const profileFollowerText = nftsLoading
    ? "…"
    : nftsError
      ? "—"
      : `${likesSum.toLocaleString()} followers`;

  const copyWallet = () => {
    if (!profileWallet) return;
    void navigator.clipboard?.writeText(profileWallet);
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {showNoId && (
                  <div className="py-5 text-center">
                    <p>Choose an author from Top Sellers on the home page.</p>
                    <Link to="/" className="btn-main">
                      Back to home
                    </Link>
                  </div>
                )}

                {authorId != null && error && !loading && (
                  <div className="py-5 text-center">
                    <p>{error}</p>
                    <Link to="/" className="btn-main">
                      Back to home
                    </Link>
                  </div>
                )}

                {showExploreError && (
                  <div className="py-5 text-center">
                    <p>{nftsError}</p>
                    <Link to="/" className="btn-main">
                      Back to home
                    </Link>
                  </div>
                )}

                {showLoadingProfile && (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <p className="mb-0">Loading…</p>
                      </div>
                    </div>
                  </div>
                )}

                {showNotFound && (
                  <div className="py-5 text-center">
                    <p>Author not found.</p>
                    <Link to="/" className="btn-main">
                      Back to home
                    </Link>
                  </div>
                )}

                {showProfile && (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <ImageWithFallback
                          src={resolvedAuthor.authorImage}
                          fallbackSrc={AuthorImage}
                          alt={resolvedAuthor.authorName}
                        />

                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {resolvedAuthor.authorName}
                            <span className="profile_username">
                              {profileUsername}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {profileWallet}
                            </span>
                            <button
                              id="btn_copy"
                              type="button"
                              title="Copy wallet"
                              onClick={copyWallet}
                            >
                              Copy
                            </button>
                          </h4>
                          <span className="d-block mt-2">
                            {resolvedAuthor.price} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {profileFollowerText}
                        </div>
                        <Link to="#" className="btn-main">
                          Follow
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showProfile && (
                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems
                      items={nftItems}
                      loading={nftsLoading}
                      error={nftsError}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
