import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../features/auth/authSlice";
import { FaPlus, FaTrashCan } from "react-icons/fa6";

export default function Home() {
  const [items, setitems] = useState(null);
  const [search, setSearch] = useState("");
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  async function getItems(search = "") {
    //this will fetch to the backend to get the items and search the items
    const response = await fetch(`/api/items?search=${search}`);
    const result = await response.json(); //gets the response to json
    setitems(result);
  }
  // this will move to the create items page
  function handleCreateItemClick() {
    navigate("/create/items");
  }

  // this will fetch to the backend to delete the item
  async function handleDelete(id) {
    try {
      const deleteResponse = await fetch(`/api/items/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, //you need to be logged in and you have to be the owner
        },
      });
      if (deleteResponse.ok) {
        // this will  rerender the page to update the items
        const response = await fetch(`/api/items`);
        const result = await response.json();
        setitems(result);
      } else {
        let getResponse = await deleteResponse.json();
        let message = getResponse?.message;
        if (message) {
          setError(message);
          setId(id);
        }
      }
    } catch (error) {}
  }

  // anytime the search is changed it will run the getItems function
  useEffect(() => {
    getItems(search);
  }, [search]);

  return (
    <div className="items-container page__height">
      <div className="sub-nav flex justify-space-between">
        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
        />

        {token ? (
          <button className="create-btn" onClick={handleCreateItemClick}>
            <h4 className="post-button-space">Post</h4>
            <FaPlus />
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="container">
        {items ? (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              {error && id === item.id ? (
                <h1 className="edit-error">{error}</h1>
              ) : (
                ""
              )}
              {/* when we click on this link it will bring us to the item details page */}
              <Link to={`/items/${item.id}`} className="item-link">
                <div
                  className="fullBg"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                ></div>
                <h3>{item.description}</h3>
              </Link>
              {token ? (
                <div className="flex justify-flex-end">
                  <button
                    className="delete__btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrashCan />
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ))
        ) : (
          <p className="loader"></p>
        )}
      </div>
    </div>
  );
}
