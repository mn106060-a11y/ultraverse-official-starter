import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const Author = () => {
    const { id } = useParams();
      const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    useEffect(() => {
    setAuthor(null);
    setError("");

    if (!id) {
      setError("Select a creator to view their profile.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    async function loadAuthor() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
          { params: { author: id } }
        );
        if (active) setAuthor(data);
      } catch {
        if (active) setError("Unable to load this creator’s profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAuthor();
    return () => {
      active = false;
    };
  }, [id]);
      if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <section
            id="profile_banner"
            aria-label="Profile banner"
            className="text-light"
            style={{ background: `url(${AuthorBanner}) top` }}
          ></section>

          <section aria-label="Loading creator profile">
            <div className="container" role="status" aria-busy="true">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <Skeleton circle width={150} height={150} />
                      <h4><Skeleton width={200} /></h4>
                      <Skeleton width={120} />
                      <br />
                      <Skeleton width={240} />
                    </div>
                    <div className="de-flex-col">
                      <Skeleton width={120} height={20} />
                      <br />
                      <Skeleton width={100} height={40} />
                    </div>
                  </div>
                </div>

                {Array.from({ length: 4 }, (_, index) => (
                  <div className="col-lg-3 col-md-6" key={index}>
                    <div className="nft__item">
                      <Skeleton circle width={50} height={50} />
                      <div className="nft__item_wrap">
                        <Skeleton width="100%" height={264} />
                      </div>
                      <Skeleton width="70%" height={20} />
                      <Skeleton width="40%" height={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  if (error) return <p role="alert">{error}</p>;
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
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author?.authorImage || AuthorImage} alt={author?.authorName || "Creator"} />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author?.authorName}
                          <span className="profile_username">{author?.tag}</span>
                          <span id="wallet" className="profile_wallet">
                            {author?.address}
                          </span>
                          <button id="btn_copy" type="button" title="Copy wallet address" onClick={() => navigator.clipboard.writeText(author.address)}>
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{author?.followers} followers</div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                 <AuthorItems items={author?.nftCollection ?? []} author={author} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
