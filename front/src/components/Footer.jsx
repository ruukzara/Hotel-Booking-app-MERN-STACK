import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./index.css"
import http from '../http';

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState([])
  const [category, setCategory] = useState([])

  const handleSubscribe = () => {
    setSubscribed(true);
  };
  useEffect(() => {
    setLoading(true)
    http.get('/hotel/latest')
      .then(({ data }) => {
        setCity(data)
      })
      .catch(err => { })

    http.get('/hotel/featured')
      .then(({ data }) => setFeatured(data))
      .catch(err => { })

    http.get('/hotel/category/all')
      .then(({ data }) => {
        setCategory(data)
          .then(({ data }) => { setCategoryHotels(data) })

          .catch(err => { })

        setLoading(false)

      }, [])

      .catch(err => { });
  }, []);


  return (
    <footer>
      <div className="footer-columns">
        <div className="footer-column">
          <ul>
            <Link to={"/search"} style={{ textDecoration: "none" }}>
              {category.map((hotel, _id) => (
                <li key={hotel._id}>{hotel.name}</li>
              ))}
            </Link>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <Link to={"/search"} style={{ textDecoration: "none" }}>
              {city.map((hotel, _id) => (
                <li key={hotel._id}>Hotels in {hotel.city}</li>
              ))}
            </Link>
          </ul>
        </div>
        <div className="footer-column">
          <ul>
            <Link to={"/search"} style={{ textDecoration: "none" }}>
              {featured.map((hotel, _id) => (
                <li key={hotel._id}>{hotel.name}</li>
              ))}
            </Link>
          </ul>
        </div>
        <div className="footer-column">
          <div className='subscribe-btn'>
            <h1 className='subscribe-btn-h1'>Welcome to Our Newsletter</h1>
            <p className='subscribe-btn-p'>Subscribe to get the latest news and updates!</p>
            <button onClick={handleSubscribe} disabled={subscribed}>
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};


