import React, { useState } from 'react'
import './NavMenu.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isNull } from '../lib'
import { clearStorage } from '../lib'
import { clearUser } from '../store'

export const NavMenu = () => {
  const user = useSelector(st => st.user.value)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const dispatch = useDispatch()

  const handleLogout = () => {
    clearStorage('cms_token')
    dispatch(clearUser())
  }

  return !isNull(user) ? <>
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/cms" className="logo">
          <i className="fa-solid fa-hotel"></i> {import.meta.env.VITE_APP_NAME}
        </Link>
      </div>

      <div className={`dropdown ${isDropdownOpen ? 'open' : ''}`}>
        <div className="navbar-link" onClick={toggleDropdown}>
          <i className='fa-solid fa-user-circle'></i> {user.name} <i className={`fa-solid ${isDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <li>
              <Link to="/cms/edit-profile">Edit Profile</Link>
            </li>
            <li>
              <Link to="/cms/change-password">Change Password</Link>
            </li>
            <hr />
            <li>
              <button onClick={handleLogout} style={{ outline: 'none', border: 'none', background: 'transparent' }}>
                <i className="fa-solid fa-right-from-bracket"></i> <b>Logout</b>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className='navbar-menu'></div>

    </nav >
  </> : null
}