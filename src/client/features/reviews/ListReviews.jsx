import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { logout, selectToken } from "../../features/auth/authSlice";

export default function Reviews() {
  const [reviews, setreviews] = useState(null);
  const token = useSelector(selectToken);

  async function getReviews() {
    const response = await fetch("/api/reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    setreviews(result);
  }

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className="items-container">
      <h2>reviews</h2>

      {reviews ? (
        reviews.map((item) => (
          <div className="item-card" key={item.id}>
            <h3>{item.reviewText}</h3>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
