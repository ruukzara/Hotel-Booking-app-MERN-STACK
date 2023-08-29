import React, { useEffect, useState } from 'react';
import { Footer, HotelAllCard } from '../../components';

export const Favourites = () => {
  const [wishlist, setWishlist] = useState(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const removeFromWishlist = (hotel) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== hotel._id);
    setWishlist(updatedWishlist);
  };


  return (
    <>
      <div style={{ textAlign: 'center', marginTop: "60px" }}>
        <div className="slider-container-1" style={{ display: 'inline-block', textAlign: "start" }}>
          {wishlist.length > 0 ? (
            <div className="slider-container-1" style={{ display: 'inline-block', textAlign: "start" }}>
              {wishlist.map((hotel) => (
                <HotelAllCard
                  key={hotel._id}
                  hotel={hotel}
                  onRemoveFromWishlist={removeFromWishlist} // Pass the removeFromWishlist function
                />
              ))}
            </div>
          ) : (
            <div className="empty-wishlist-card" style={{textAlign:"center", justifyContent:"center", display:"flex" }}>
              <h2>No Hotels Saved Yet..</h2>
            </div>
          )}
        </div>
      </div>
      <Footer />

    </>
  );
};
