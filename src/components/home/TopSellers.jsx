import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
const TopSellers = () => {
    const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTopSellers() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setSellers(data);
      } catch (error) {
        console.error("Error fetching top sellers:", error);
        setError("Unable to load top sellers. Please refresh to try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {error && <p role="alert">{error}</p>}
<ol className="author_list">
  {loading && Array.from({ length: 12 }, (_, index) => (
    <li key={`loading-${index}`} aria-hidden="true">
      <div className="author_list_pp">
        <Skeleton width="50px" height="50px" borderRadius="50%" />
      </div>
      <div className="author_list_info">
        <Skeleton width="100px" height="16px" />
        <br />
        <Skeleton width="60px" height="14px" />
      </div>
    </li>
  ))}
              {sellers.map((seller) => (
  <li key={seller.id}>
                  <div className="author_list_pp">
                    <Link to={`/author/${seller.authorId}`}>
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt={`View ${seller.authorName}'s profile`}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to={`/author/${seller.authorId}`}>{seller.authorName}</Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
