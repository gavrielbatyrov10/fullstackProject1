import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logout, selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SingleItem() {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description })
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

            <span className="average-rating">
              {/* this is calling the AverageRating function */}
              (Avg Rating: {calculateAverageRating(item.Review).toFixed(2)})
            </span>
            <br />
            {token ? <button type="submit">Edit</button> : ""}
          </form>
          <h3>Reviews:</h3>
          <ul className="reviews-list">
            {/* this will displaye multiple reviews */}
            {item.Review.map((review) => (
              <li key={review.id} className="review-item">
                {/* this is the score */}
                <div className="review-rating">Rating: {review.rating}</div>
                {/* this is the review text */}
                <div className="review-text">{review.reviewText}</div>
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
