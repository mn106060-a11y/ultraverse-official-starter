import React, { useEffect, useState } from "react";
import EthImage from "../images/ethereum.svg";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ItemDetails = () => {
    const { id } = useParams();
      const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setItem(null);
    setError("");

    if (!id) {
      setError("Select an NFT to view its details.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    async function loadItem() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails",
          { params: { nftId: id } }
        );
        if (active) setItem(data);
      } catch {
        if (active) setError("Unable to load this NFT. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadItem();
    return () => {
      active = false;
    };
  }, [id]);
    if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <section className="mt90 sm-mt-0" aria-label="Loading NFT details">
            <div className="container" role="status" aria-busy="true">
              <div className="row">
                <div className="col-md-6 text-center">
                  <Skeleton
                    height={500}
                    className="mb-sm-30"
                    borderRadius={8}
                  />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <h2><Skeleton width="75%" /></h2>
                    <div className="item_info_counts">
                      <Skeleton width={80} height={30} />
                    </div>
                    <p><Skeleton count={3} /></p>
                    <h6>Owner</h6>
                    <Skeleton circle width={50} height={50} />
                    <Skeleton width={140} />
                    <div className="spacer-20"></div>
                    <h6>Creator</h6>
                    <Skeleton circle width={50} height={50} />
                    <Skeleton width={140} />
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <Skeleton width={100} height={32} />
                  </div>
                </div>
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
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage || nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title} #{item.tag}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item.likes}
                    </div>
                  </div>
                  <p>{item.description}</p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.ownerId}`}>
                            <img className="lazy" src={item.ownerImage || AuthorImage} alt={item.ownerName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.ownerId}`}>{item.ownerName}</Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.creatorId}`}>
                            <img className="lazy" src={item.creatorImage || AuthorImage} alt={item.creatorName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.creatorId}`}>{item.creatorName}</Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
