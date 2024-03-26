import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout, selectToken } from "../../features/auth/authSlice";

export default function CreateItem() {
  const [description, setDescription] = useState("");
  const token = useSelector(selectToken);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });
      if (response.ok) {
        navigate("/");
      } else {
        // think about setting an error in state so you can display it in your UI
        console.error("Failed to create item");
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
