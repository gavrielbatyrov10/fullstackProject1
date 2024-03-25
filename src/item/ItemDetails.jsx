import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SingleItem() {
  const [item, setItem] = useState(null);
  let { id } = useParams();

  async function getItem() {
    try {
      const response = await fetch(`http://localhost:8000/api/items/${id}`);
      const result = await response.json();
      setItem(result);
    } catch (error) {
      console.error("Error fetching item:", error);
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
          <h2>{item.description}</h2>
          <span className="average-rating">
            {/* thiss is calling the AverageRating function */}
            (Avg Rating: {calculateAverageRating(item.Review).toFixed(2)})
          </span>
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
        <p>Loading...</p>
      )}
    </div>
  );
}
