import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { logout, selectToken } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EditComment() {
  const [commentBody, setCommentBody] = useState(null);
  let { id } = useParams();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const [comment, setComment] = useState({});
  const handleUpdateComment = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchComment();
  }, [id, token]);

  async function fetchComment() {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const commentData = await response.json();
        setCommentBody(commentData.body);
        setComment(commentData);
      } else {
        console.error("Failed to fetch comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comment:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: commentBody }),
      });
      if (response.ok) {
        navigate(`/edit/review/${comment.reviewId}`);
      } else {
        console.error("Failed to update comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  }
  return (
    <div>
      <h2>Edit Comment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Comment:
          <input
            className="edit-wrapper"
            type="text"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            required
          />
        </label>
        <button className="" type="submit">
          Update Comment
        </button>
      </form>
    </div>
  );
}
