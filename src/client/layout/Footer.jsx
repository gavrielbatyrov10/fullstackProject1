import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../features/auth/authSlice";

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
        <li className="links">
          <NavLink to="/">Home</NavLink>
        </li>
        {token && (
          <li className="links">
            <NavLink to="/reviews">Reviews</NavLink>
          </li>
        )}
        {token ? (
          <li className="links">
            <a onClick={handleLogout}>Log Out</a>
          </li>
        ) : (
          <li className="links">
            <NavLink to="/login">Log In</NavLink>
          </li>
        )}
      </ul>
    </footer>
  );
}
