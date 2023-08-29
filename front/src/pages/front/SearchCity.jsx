import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import http from '../../http';
import './SearchCity.css';
import { imgUrl } from '../../lib';
import { Search } from '../../components';

export const SearchCity = () => {
    const [city, setCity] = useState([]);
    const [wishlist, setWishlist] = useState(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    });

    const params = useParams();

    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    const addToWishlist = (hotel) => {
        setWishlist((prevWishlist) => {
            if (prevWishlist.some((item) => item._id === hotel._id)) {
                const updatedWishlist = prevWishlist.filter((item) => item._id !== hotel._id);
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                return updatedWishlist;
            } else {
                const updatedWishlist = [...prevWishlist, hotel];
                localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                return updatedWishlist;
            }
        });
    };

    const IconContainer = ({ capacity }) => {
        if (capacity === null) {
            return null;
        } else if (!isNaN(capacity)) {
            return Array.from({ length: capacity }, (_, index) => <i key={index} className="fa-solid fa-user"></i>);
        } else {
            return null;
        }
    };

    const getCity = async () => {
        try {
            const { data } = await http.get(`/search/city/${params.city}`);
            setCity(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getCity();
    }, [params.city]);

    const Option = ({ icon, children }) => (
        <div className="option">
            <i className={`fa-solid ${icon}`}></i>
            <span>{children}</span>
        </div>
    );

    return (
        <>
            <Search />

            {city.length > 0 ? (
                city.map((hotel) => (
                    <div key={hotel._id}>
                        <div className="hotel-city-card">
                            <div style={{ display: 'flex' }}>
                                <div className="hotel-image-container">
                                    <Link to={`/search/${hotel._id}`} style={{ textDecoration: "none" }}>
                                        {hotel.hotelImages && hotel.hotelImages[0] && (
                                            <img src={imgUrl(hotel.hotelImages[0])} alt={hotel.name} className="hotelall-image" />
                                        )}
                                    </Link>
                                    <div className="wishlist-icon" onClick={() => addToWishlist(hotel)}>
                                        {wishlist.some((item) => item._id === hotel._id) ? (
                                            <i className="fa-solid fa-heart wishlist-active"></i>
                                        ) : (
                                            <i className="fa-regular fa-heart heartify"></i>
                                        )}
                                    </div>
                                </div>
                                <div className="image-side">
                                    <div className="hotel-details">
                                        <div>
                                            <Link to={`/search/${hotel._id}`} style={{ textDecoration: "none" }}>
                                                <h2 className="hotelall-name">{hotel.name}</h2>
                                            </Link>
                                        </div>

                                        <div>
                                            {hotel.room && hotel.room.length > 0 ? (
                                                <div key={hotel.room[0]._id}>
                                                    <div style={{ display: 'flex' }} className="room-details-main">
                                                        <p>{hotel.room[0].title}</p> &nbsp;&nbsp;
                                                        <h3>
                                                            {' '}
                                                            <i className="fa-solid fa-circle-dot"></i>{' '}
                                                        </h3>
                                                        &nbsp;&nbsp;
                                                        <h2 className="hotelall-distance">{hotel.distance}</h2>
                                                    </div>
                                                    <p style={{ fontSize: '14px' }}>
                                                        <IconContainer capacity={hotel.room[0].capacity} />
                                                    </p>
                                                </div>
                                            ) : null}

                                            <div>
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

                                            <div className="room-details">
                                                <p className="hotelall-price">
                                                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                    <span style={{ fontSize: '12px', color: 'black' }}>per night </span> <br /> Price Rs. {hotel.price}
                                                </p>
                                                <Link to={`/search/${hotel._id}`}>
                                                    <button>See Availability</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <h1>No Hotel Found </h1>
            )}
        </>
    );
};
