import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../features/auth/authSlice";
import "../../client/index.less";

import { FaHome } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import Search from "../features/home/Search";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="top-navbar">
        <h1 className="logo">PawPals</h1>
        <ul className="menu1">
 <li className="links-search">
              <Search />
            </li>

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
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          ) : (
            <li className="links">
              <NavLink to="/login">Log In</NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className={`bottom-navbar ${isMenuOpen ? "open" : ""}`}>
        <div
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </div>
        <ul className="menu">
          <li className="links">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)}>
              <FaHome />
            </NavLink>
          </li>
          {token && (
            <li className="links">
              <NavLink to="/reviews" onClick={() => setIsMenuOpen(false)}>
                <TfiWrite />
              </NavLink>
            </li>
          )}
          {token ? (
            <li className="links">
              <button className="logout-btn" onClick={handleLogout}>
              Log Out
              </button>
            </li>
          ) : (
            <li className="links">
              <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                Log In
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
