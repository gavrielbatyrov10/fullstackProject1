import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout, selectToken } from "../../features/auth/authSlice";

export default function Home() {
  const [items, setitems] = useState(null);
  const [search, setSearch] = useState("");
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  async function getItems(search = "") {
    const response = await fetch(`/api/items?search=${search}`);
    const result = await response.json();
    setitems(result);
  }

  function handleCreateItemClick() {
    navigate("/create/items");
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:8000/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await fetch(`http://localhost:8000/api/items`);
      const result = await response.json();
      setitems(result);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  useEffect(() => {
    getItems(search);
  }, [search]);

  return (
    <div className="items-container">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <h2>Items</h2>
      {token ? (
        <button className="create-btn" onClick={handleCreateItemClick}>
          Create Item
        </button>
      ) : (
        ""
      )}
      <div className="container">
        {items ? (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              <Link to={`/items/${item.id}`} className="item-link">
                <img className="img" src={item.imageUrl} />
                <h3>{item.description}</h3>
              </Link>
              {token ? (
                <button onClick={() => handleDelete(item.id)}>
                  Delete Item
                </button>
              ) : (
                ""
              )}
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
