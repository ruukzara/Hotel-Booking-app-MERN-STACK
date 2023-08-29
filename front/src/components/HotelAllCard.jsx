import React, { useEffect, useState } from 'react';
import { imgUrl } from '../lib';
import { Link } from 'react-router-dom';

export const HotelAllCard = ({ hotel }) => {
  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Save the wishlist to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (hotel) => {
    if (wishlist.some(item => item._id === hotel._id)) {
      const updatedWishlist = wishlist.filter(item => item._id !== hotel._id);
      setWishlist(updatedWishlist);
    } else {
      setWishlist([...wishlist, hotel]);
    }
  };

  const IconContainer = ({ capacity }) => {
    if (capacity === null) {
      return null;
    } else if (!isNaN(capacity)) {
      return Array.from({ length: capacity }, (_, index) => <i key={index} className="fa-solid fa-user"></i>);
    } else {
      return null;
    }
  }

  const Option = ({ icon, children }) => (
    <div className="option">
        <i className={`fa-solid ${icon}`}></i>
        <span>{children}</span>
    </div>
);

  const { _id, name, distance, room, price, breakfastIncluded, freeCancellation, airportPickup, pool, noPrepayment, hotelImages } = hotel;

  return (
    <div className="hotelcity-card">
      <div style={{ display: 'flex' }}>
        <div className="hotel-image-container">
          <Link key={hotel._id} to={`/search/${hotel._id}`} >
            {hotel.hotelImages && hotel.hotelImages[0] && (
              <img src={imgUrl(hotel.hotelImages[0])} alt={name} className="hotelall-image" />
            )}
          </Link>
          <div className="wishlist-icon" onClick={() => addToWishlist(hotel)}>
            {/* Check if the hotel is in the wishlist to determine the heart icon */}
            {wishlist.some(item => item._id === hotel._id) ? (
              <i className="fa-solid fa-heart wishlist-active"></i>
            ) : (
              <i className="fa-regular fa-heart heartify"></i>
            )}
          </div>
        </div>
        <div className="image-side">
          <div className="hotel-details">
            <Link key={hotel._id} to={`/search/${hotel._id}`} style={{ textDecoration: "none" }}>
              <div>
                <h2 className="hotelall-name">{name}</h2>
              </div>
            </Link>

            <div>
              <div>
                {room && room.length > 0 ? (
                  <div key={room[0]._id}> {/* Display only the first element */}
                    <main></main>
                    <div style={{ display: "flex" }} className='room-details-main'>
                      <p>{room[0].title.replace(/ - \d+$/, '')}</p> &nbsp;&nbsp;
                      <h3> <i className="fa-solid fa-circle-dot"></i> </h3>&nbsp;&nbsp;
                      <h2 className="hotelall-distance">{hotel.distance}</h2>
                    </div>
                    <p style={{ fontSize: "14px", color: "blue" }}><IconContainer capacity={room[0].capacity} /></p>
                  </div>
                ) : null}
              </div>

              <div>
                <div className='room-details'>
                  <p className="hotelall-price">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style={{ fontSize: "12px", color: "black" }}>per night </span> <br /> Price Rs. {hotel.price}</p>
                  <Link key={hotel._id} to={`/search/${hotel._id}`} style={{ textDecoration: "none" }}>
                    <button>
                      See Availability
                    </button>
                  </Link>
                </div>
                <div className="hotelall-options">
                  <div className="options-container">
                    {hotel.breakfastIncluded && <Option icon="fa-mug-saucer">Breakfast Included</Option>}
                    {hotel.freeCancellation && <Option icon="fa-check">Free Cancellation</Option>}
                    {hotel.airportPickup && <Option icon="fa-truck-pickup">Airport Pickup</Option>}
                    {hotel.pool && <Option icon="fa-person-swimming">Swimming Pool</Option>}
                    {hotel.noPrepayment && <Option icon="fa-money-check-dollar">No Pre-payment</Option>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


