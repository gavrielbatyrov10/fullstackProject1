import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logout, selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditReview() {
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  let { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchReview() {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const reviewData = await response.json();
          setReview(reviewData);
          setRating(reviewData.rating);
          setReviewText(reviewData.reviewText);
          console.log(reviewData);
        } else {
          console.error("Failed to fetch review:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }

    fetchReview();
  }, [id, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, reviewText }),
      });
      if (response.ok) {
        navigate(`/items/${review.itemId}`);
      } else {
        console.error("Failed to update review:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  }
  return (
    <div>
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>
        <label>
          Review Text:
          <input
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Review</button>
      </form>
    </div>
  );
}
