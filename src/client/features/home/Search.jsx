import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function Search() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [overlayOpen, setOverlayOpen] = useState(false);

  async function getItems(search = "") {
    const response = await fetch(`/api/items?search=${search}`);
    const result = await response.json();
    setItems(result.reverse());
  }

  useEffect(() => {
    if (overlayOpen) getItems(search);
  }, [search, overlayOpen]);

  return (
    <>
      {/* 🔍 Button to open overlay */}
      <button className="open-search-btn" onClick={() => setOverlayOpen(true)}>
        <FaSearch size={18} />
      </button>

      {/* Overlay */}
      {overlayOpen && (
        <div className="search-overlay">
          <div className="search-box">
            <button className="close-btn" onClick={() => setOverlayOpen(false)}>
              {/* <FaTimes size={50} /> */}
            </button>

            <input
              autoFocus
              className="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
            />

            <div className="results-container">
              {items && items.length > 0 ? (
                items.map((item) => (
                  <div className="item-card" key={item.id}>
                    <Link to={`/items/${item.id}`} className="item-link">
                      <div
                        className="fullBg"
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      ></div>
                      <h3 className="card__title">{item.description}</h3>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="no-results">No items found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
