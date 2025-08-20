import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../features/auth/authSlice";
import "../../client/index.less";

export default function Footer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <footer>
      <ul className="menu__footer">
        <li className="links2">
          <NavLink to="/" className="footer-link">Home</NavLink>
        </li>
        {token && (
          <li className="links2">
            <NavLink to="/reviews" className="footer-link">Reviews</NavLink>
          </li>
        )}
        {token ? (
          <li className="links2">
            <button onClick={handleLogout} className="footer-link logout-btn">
              Log Out
            </button>
          </li>
        ) : (
          <li className="links2">
            <NavLink to="/login" className="footer-link">Log In</NavLink>
          </li>
        )}
      </ul>
    </footer>
  );
}
