import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logout, selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SingleItem() {
  const [newRating, setNewRating] = useState("");
  const [newReviewText, setNewReviewText] = useState("");

  const [item, setItem] = useState(null);
  const [description, setDescription] = useState("");
  let { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  async function getItem() {
    try {
      const response = await fetch(`/api/items/${id}`);
      const result = await response.json();
      setItem(result);
      setDescription(result.description);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  useEffect(() => {
    getItem();
  }, []);
  // this will calculate the average amount of ratings
  function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }

  async function saveReview() {
    try {
      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: newRating,
          itemId: id,
          reviewText: newReviewText,
        }),
      });
      if (response.ok) {
        // If review saved successfully, refresh the item data
        await getItem();
        // Clear input fields
        setNewRating("");
        setNewReviewText("");
      } else {
        console.error("Failed to save review:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving review:", error);
    }
  }

  async function deleteReview(reviewId) {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        // If review deleted successfully, refresh the item data
        await getItem();
      } else {
        console.error("Failed to delete review:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  return (
    <div className="single-item-container">
      {item ? (
        <div className="item-details">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {token ? <button type="submit">Edit</button> : ""}
          </form>
          <br />
          <span className="average-rating">
            {/* this is calling the AverageRating function */}
            (Avg Rating: {calculateAverageRating(item.Review).toFixed(2)})
          </span>
          <br />
          {token && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveReview();
              }}
            >
              <label>
                Rating:
                <input
                  type="number"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  required
                />
              </label>
              <label>
                Review Text:
                <input
                  type="text"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save Review</button>
            </form>
          )}
          <h3 className="review-words">Reviews:</h3>
          <ul className="reviews-list">
            {/* this will displaye multiple reviews */}
            {item.Review.map((review) => (
              <li key={review.id} className="review-item">
                {/* this is the score */}
                <div className="review-rating">Rating: {review.rating}</div>
                {/* this is the review text */}
                <div className="review-text">{review.reviewText}</div>
                {token && (
                  <div>
                    <button
                      onClick={() => navigate(`/edit/review/${review.id}`)}
                    >
                      Edit Review
                    </button>
                    <br />
                    <button onClick={() => deleteReview(review.id)}>
                      Delete Review
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="loader"></p>
      )}
    </div>
  );
}
