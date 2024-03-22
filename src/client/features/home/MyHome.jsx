import React, { useEffect, useState } from "react";

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
    <div>
      {/* if itemes are there map it if not dont map it */}
      {items &&
        items.map((item) => (
          <div key={item.id}>
            <h3>{item.description}</h3>
          </div>
        ))}
    </div>
  );
}
