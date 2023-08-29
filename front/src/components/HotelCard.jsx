import React from 'react';
import { imgUrl } from '../lib';
import "./HotelIndex.css"

export const HotelCard = ({ hotel }) => {
    const { name, city, price, hotelImages, Discounted_Price, country } = hotel;

    const getSmallestPrice = () => {
        if (typeof Discounted_Price === 'number' && !isNaN(Discounted_Price)) {
            return parseFloat(price) - parseFloat(Discounted_Price);
        } else {
            return parseFloat(price);
        }
    };
    return (
        <div className="hotel-card">
            <div className="hotel-image-container">
                <p className="hotel-location">{city}</p>
                {hotelImages && hotelImages[0] && (
                    <img src={imgUrl(hotelImages[0])} alt={name} className="hotel-image" />
                )}
                {<div className="featured-tag">Featured</div>}
                
            </div>
            <div className="hotel-details">
                <h2 className="hotel-name">{name}</h2>
                <p>{city}, {country}</p>
                <p style={{fontSize:"12px"}}>Price strarting from ${getSmallestPrice()}</p>
            </div>
        </div>
    );
};
