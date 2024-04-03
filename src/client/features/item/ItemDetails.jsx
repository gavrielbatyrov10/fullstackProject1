import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SingleItem() {
  const [newRating, setNewRating] = useState("");
  const [newReviewText, setNewReviewText] = useState("");

  const [item, setItem] = useState(null);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // this gets the id of an item from the url
  let { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  // this will get the individual item
  async function getItem() {
    try {
      const response = await fetch(`/api/items/${id}`);
      const result = await response.json();
      setItem(result);
      setDescription(result.description);
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  }
  // when you save a review it will navigate to the home page
  const handleSaveReview = () => {
    navigate("/");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, imageUrl }),
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }
  // this will get individual item when the page loads
  useEffect(() => {
    getItem();
  }, []);
  // this will calculate the average amount of ratings
  function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  }
  // this will save the review
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
            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              Image Url:
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </label>
            {token ? <button type="submit">Edit</button> : ""}
          </form>
          <br />
          <span className="average-rating">
            {/* this is calling the AverageRating function */}
            (Avg Rating: {calculateAverageRating(item.Review).toFixed(2)})
          </span>
          <br />
          {/* if the user is logged in show the form */}
          {token && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveReview();
              }}
            >
              <label className="rating-update">
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
              <button onClick={() => handleSaveReview} type="submit">
                Save Review
              </button>
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
                  <div className="btn-wrapper">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit/review/${review.id}`)}
                    >
                      Edit Review
                    </button>
                    <br />
                    <button
                      className="delete-btn"
                      onClick={() => deleteReview(review.id)}
                    >
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
