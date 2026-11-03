import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import axios from "axios";
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
    if (loading) return <p role="status">Loading creator profile…</p>;
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
