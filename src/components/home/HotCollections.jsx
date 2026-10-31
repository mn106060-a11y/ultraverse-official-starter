import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Skeleton from "../UI/Skeleton";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const owlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    slideBy: 1,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      1200: { items: 4 },
    },
  };

  useEffect(() => {
    async function fetchHotCollections() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );

        setCollections(data);
      } catch (error) {
        console.error("Error fetching hot collections:", error);
        setError("Unable to load collections. Please refresh to try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchHotCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            <OwlCarousel
              key="loading"
              className="owl-theme"
              {...owlOptions}
            >
              {Array.from({ length: 4 }, (_, index) => (
                <div className="nft_coll" key={index}>
                  <div className="nft_wrap">
                    <Skeleton width="100%" height="200px" />
                  </div>

                  <div className="nft_coll_pp">
                    <Skeleton
                      width="50px"
                      height="50px"
                      borderRadius="50%"
                    />
                  </div>

                  <div className="nft_coll_info">
                    <Skeleton width="100px" height="20px" />
                    <br />
                    <Skeleton width="60px" height="20px" />
                  </div>
                </div>
              ))}
            </OwlCarousel>
          ) : error ? (
            <div className="col-12 text-center" role="alert">
              <p>{error}</p>
            </div>
          ) : (
            <OwlCarousel
              key="collections"
              className="owl-theme"
              {...owlOptions}
            >
              {collections.map((item) => (
                <div className="nft_coll" key={item.id}>
                  <div className="nft_wrap">
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy img-fluid"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img
                        className="lazy pp-coll"
                        src={item.authorImage}
                        alt={`Creator of ${item.title}`}
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft_coll_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <span>ERC-{item.code}</span>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;