import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NavbarMenu.css"
import { useDispatch, useSelector } from "react-redux";
import { clearStorage, inStorage, isNull } from "../lib";
import { clearUser } from "../store";
import http from "../http";

export const NavBarMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen)
  }

  const user = useSelector(st => st.user.value)
  const dispatch = useDispatch()

  const handleLogout = () => {
    clearStorage('user_token')
    dispatch(clearUser())
  }

  useEffect(() => {
    if (isNull(user)) {
      const token = inStorage('user_token')

      if (token) {
        http.get('/profile/details')
          .then(({ data }) => {
            dispatch(addUser(data))
          })

          .catch(err => {
            if (err && err.status && err.response.status == 401) {
              clearStorage('user_token')
            }
          })
      }
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return <>
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="https://png.pngtree.com/png-clipart/20190520/original/pngtree-hotel-icon-png-image_3570106.jpg" style={{ height: "50px", width: "50px" }} alt="Hotel Logo" /> Hotel App
        </Link>
        <li className="nav-item-block" style={{ display: "none" }}>
          <div onClick={toggleNavDropdown} ><i className="fa-solid fa-bars"></i> &nbsp; Menu </div>
        </li>
        <ul className="nav-menu" style={{ display: isNavDropdownOpen ? "none" : "flex" }}>

          <li className="nav-item">
            <Link to="/favourites" className="nav-links">
              <i className="fa-regular fa-heart"></i> &nbsp; Favourites
            </Link>
          </li>


          <li className="nav-item">
            <Link to="/contact" className="nav-links"><i className="fa-solid fa-question"></i>  Help</Link>
          </li>

          {isNull(user) ?
            <>
              <li className="nav-item">
                <Link to="/register" className="register-links">
                  &nbsp; Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="login-links">
                  &nbsp; Login
                </Link>
              </li>
            </>
            : <>
              <li className="nav-item">
                <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
                  <div className="navbar-links-menu" onClick={toggleDropdown}>
                    <div style={{ fontFamily: "Montserrat', sans-serif", fontWeight: "bold", fontSize: "16px", color: "blue" }}
                    >
                     <span className="nav-links"> <i className='fa-solid fa-user-circle'></i> {user.name}
                      <i className={`fa-solid ${isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i></span>
                    </div>
                  </div>
                  <ul className={`custom-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                    <li className="custom-dropdown-item">
                      <Link to="/"> Home </Link>
                    </li>
                    <li className="custom-dropdown-item">
                      <Link to="/edit-profile">Edit Profile</Link>
                    </li>
                    <li className="custom-dropdown-item">
                      <Link to="/change-password">Change Password</Link>
                    </li>
                    <hr className="custom-dropdown-divider" />
                    <li className="custom-dropdown-item">
                      <button onClick={handleLogout} className="custom-logout-button">
                        <i className="fa-solid fa-right-from-bracket"></i> <b>Logout</b>
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </>
          }

        </ul>
      </div>
    </nav>
  </>
};

