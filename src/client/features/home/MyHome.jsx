import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [items, setitems] = useState(null);

  async function getItems() {
    const response = await fetch(`http://localhost:8000/api/items`, {});
    const result = await response.json();

    setitems(result);
  }
  useEffect(() => {
    getItems();
  }, []);
  return (
    <div className="items-container">
      <h2>Items</h2>
      {items ? (
        items.map((item) => (
          <div className="item-card" key={item.id}>
            <Link to={`/items/${item.id}`} className="item-link">
              <h3>{item.description}</h3>
            </Link>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
