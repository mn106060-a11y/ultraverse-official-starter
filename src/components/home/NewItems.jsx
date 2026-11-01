import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Skeleton from "../UI/Skeleton";
const Countdown = ({ expiryDate }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!expiryDate) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!expiryDate) return null;

  const remaining = Math.max(
    0,
    Math.floor((expiryDate - now) / 1000)
  );
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div className="de_countdown">
      {remaining === 0
        ? "Expired"
        : `${hours}h ${minutes}m ${seconds}s`}
    </div>
  );
};
const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const owlOptions = {
  loop: true,
  margin: 20,
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
    async function fetchNewItems() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(data);
      } catch (error) {
        console.error("Error fetching new items:", error);
        setError("Unable to load new items. Please refresh to try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchNewItems();
  }, []);
  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading && (
  <div className="row">
    {Array.from({ length: 4 }, (_, index) => (
      <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
        <div className="nft__item">
          <Skeleton width="50px" height="50px" borderRadius="50%" />
          <div className="nft__item_wrap">
            <Skeleton width="100%" height="264px" />
          </div>
          <div className="nft__item_info">
            <Skeleton width="70%" height="20px" />
            <br />
            <Skeleton width="40%" height="16px" />
          </div>
        </div>
      </div>
    ))}
  </div>
)}

{!loading && error && (
  <p role="alert">{error}</p>
)}
          {!loading && !error && items.length > 0 && (
  <OwlCarousel className="owl-theme" {...owlOptions}>
          {items.map((item) => (
  <div key={item.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to={`/author/${item.authorId}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="View creator"
                  >
                    <img className="lazy" src={item.authorImage} alt="Creator" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <Countdown expiryDate={item.expiryDate} />

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
  <h4>Share</h4>
  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `${window.location.origin}/item-details/${item.nftId}`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Share on Facebook"
  >
    <i className="fa fa-facebook fa-lg"></i>
  </a>
  <a
    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
      `${window.location.origin}/item-details/${item.nftId}`
    )}&text=${encodeURIComponent(item.title)}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Share on X"
  >
    <i className="fa fa-twitter fa-lg"></i>
  </a>
  <a
    href={`mailto:?subject=${encodeURIComponent(
      item.title
    )}&body=${encodeURIComponent(
      `${window.location.origin}/item-details/${item.nftId}`
    )}`}
    aria-label="Share by email"
  >
    <i className="fa fa-envelope fa-lg"></i>
  </a>
</div>
                    </div>
                  </div>

                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId}`}>
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}</OwlCarousel>
)}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
