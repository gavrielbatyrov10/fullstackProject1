import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../features/auth/authSlice";

export default function CreateItem() {
  const [description, setDescription] = useState("");
  const token = useSelector(selectToken);
  const [errors, setErrors] = useState("");
  const [imageUrl, setImageUrl] = useState(""); //to give imgUrl a value we set setImgUrl to a value

  const navigate = useNavigate();
  // this calls the backend url to create an item
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //if the user is logged in
        },
        body: JSON.stringify({ description, imageUrl }),
      });
      if (response.ok) {
        navigate("/");
      } else {
        let responseData = await response.json();
        // setting an error in state so you can display it to the screen
        setErrors(responseData["error"]);
      }
    } catch (error) {}
  }
  return (
    <div>
      <h2>Create Item</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <h1>{errors}</h1>
        <label>
          Image Url:
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
