import { Link } from "react-router-dom"
import "./sidebar.css"
import React, { useEffect, useState } from "react"
import http from "../../http"

export const Sidebar = () => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await http.get('/profile/details')
        const userData = response.data
        setUser(userData)
        setLoading(false)
      } catch (error) {
        console.log("Error fetching user data", error)
        setLoading(false)
      }
    }

    getData()
  }, [])

  return (
    <div className="sidebar">
      {!loading && (
        <ul className="sidebar-menu">
          <li>
            <div className="profile-card">
              <div className="profile-card-header">
                <img
                  src="https://t4.ftcdn.net/jpg/04/08/24/43/360_F_408244382_Ex6k7k8XYzTbiXLNJgIL8gssebpLLBZQ.jpg"
                  alt="Profile Picture"
                  height={100}
                  className="profile-picture"
                />
              </div>

            </div>
          </li>
          <li>
            <Link to="/cms/hotels" className="sidebar-link">
              <i className="fa-solid fa-hotel"></i>&nbsp; Hotels
            </Link>
          </li>
          <li>
            <Link to="/cms/rooms" className="sidebar-link">
              <i className="fa-solid fa-person-booth"></i>&nbsp; Rooms
            </Link>
          </li>
          <li>
            <Link to="/cms/customers" className="sidebar-link">
              <i className="fa-regular fa-user"></i>&nbsp; Customers
            </Link>
          </li>
          <li>
            <Link to="/cms/staffs" className="sidebar-link">
              <i className="fa-solid fa-clipboard-user"></i> &nbsp; Staffs
            </Link>
          </li>
          <li>
            <Link to="/cms/brands" className="sidebar-link">
              <i className="fa-solid fa-star"></i> &nbsp; Brands
            </Link>
          </li>
          <li>
            <Link to="/cms/categories" className="sidebar-link">
              <i className='fa-solid fa-th-list'></i> &nbsp; Categories
            </Link>
          </li>
          <li>
            <Link to="/cms/reviews" className="sidebar-link">
              <i className="fa-solid fa-square-poll-horizontal"></i>&nbsp; Reviews
            </Link>
          </li>
          <li>
            <Link to="/cms/bookings" className="sidebar-link">
              <i className="fa-solid fa-money-bill"></i>&nbsp; Bookings
            </Link>
          </li>
          <li>
            <Link to="/cms/orderdetails" className="sidebar-link">
              <i className="fa-solid fa-money-bill"></i>&nbsp; Order Details
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}
