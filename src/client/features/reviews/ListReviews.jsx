import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";

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
            <Link to={`/edit/review/${item.id}`} className="item-link">
              <h3>{item.reviewText}</h3>
            </Link>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
