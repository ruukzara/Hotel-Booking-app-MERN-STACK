import React from 'react';
import { imgUrl } from '../lib';
import './HotelIndex.css';

export const HotelCityCard = ({ hotel, onClick }) => {
  const { hotelImages } = hotel;

  const handleCardClick = () => {
    if (onClick) {
      onClick(hotel.city);
    }
  };

  return (
    <div className="hotelcity-card" onClick={handleCardClick}>
      {hotelImages && hotelImages[0] && (
        <>
          <div className="hotelcity-image-container">
            <img
              src={imgUrl(hotelImages[0])}
              className="hotelcity-image"
              style={{ width: '200px', height: '150px', borderRadius: '10px 10px 0px 0px', cursor: 'pointer', overflowY: 'hidden' }}
            />
          </div>
        </>
      )}
    </div>
  );
};
