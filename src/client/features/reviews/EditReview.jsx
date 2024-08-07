import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditReview() {
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [newBody, setNewBody] = useState("");
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  let { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const handleUpdateReview = () => {
    // Navigate to the home page
    navigate("/");
  };

  useEffect(() => {
    fetchReview();
  }, [id, token]);

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
      }
    } catch (error) {}
  }
  async function deleteComment(commentId) {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if there is no error from backend then it return true
      if (response.ok) {
        await fetchReview();
      } else {
        let deleteResponse = await response.json(); //this gets the data in json format
        let message = deleteResponse?.message;
        setError(message);
      }
    } catch (error) {
      console.log(error);
    }
  }

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
        let editResponse = await response.json();
        let message = editResponse?.message;
        if (message) {
          setReviewError(message);
        }
      }
    } catch (error) {}
  }
  async function handleCommentSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/comments/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          body: newBody,
        }),
      });
      if (response.ok) {
        await fetchReview();
      } else {
        console.error("Failed to save comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  }
  return (
    <div className="page__height">
      <h2>Edit Review</h2>
      {reviewError && <h1 className="edit-error">{reviewError}</h1>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </fieldset>
        <fieldset>
          <label>Review Text:</label>
          <input
            className="edit-wrapper"
            type="text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
        </fieldset>
        <fieldset className="justify-center">
          <button onClick={() => handleUpdateReview} className="" type="submit">
            Update Review
          </button>
        </fieldset>
      </form>
      <h3>Comments:</h3>
      {error && <h1 className="edit-error">{error}</h1>}
      <ul>
        {review?.Comment?.map((comment) => (
          <li className="commentList" key={comment.id}>
            <div className="commentText">{comment.body}</div>
            {token && (
              <div className="comment-btn-wrapper btn-wrapper2">
                <button onClick={() => navigate(`/edit/comment/${comment.id}`)}>
                  Edit Comment
                </button>
                <br />
                <button onClick={() => deleteComment(comment.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {token && (
        <form onSubmit={handleCommentSubmit}>
          <fieldset>
            <input
              type="text"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              required
            />
            <button type="submit">Add Comment</button>
          </fieldset>
        </form>
      )}
    </div>
  );
}
