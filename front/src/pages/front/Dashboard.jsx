import React, { useEffect, useState } from 'react'
import http from '../../http'
import { HotelAllCard, MinMaxSlider } from '../../components'
import { useLocation } from 'react-router-dom'
import { Search } from '../../components/Search'

export const Dashboard = ({ item }) => {
  const [loadings, setLoadings] = useState(false)
  const [hotels, setHotels] = useState([])
/*   const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(50000) */
  const location = useLocation()

/*   const handleSliderChange = (min, max) => {
    setMinValue(min);
    setMaxValue(max);
  }; */

  useEffect(() => {
    setLoadings(true)
    http.get('/cms/hotels')
      .then((response) => {
        setHotels(response.data)
      })
      .catch((err) => {
        console.error('Error fetching hotels:', err)
      })
      .finally(() => setLoadings(false))
  }, [])


  return (
    <>
          <Search />
{/* 
      <div style={{ margin: "-30px auto 30px 200px" }}>
        <MinMaxSlider
          minValue={minValue}
          maxValue={maxValue}
          min={0}
          max={20000}
          onChange={handleSliderChange}
        />
      </div> */}

      <div style={{ textAlign: 'center' }}>
        <div className="slider-container-1" style={{ display: 'inline-block', textAlign: "start" }}>
          {hotels.map((hotel) => (
              <HotelAllCard key={hotel._id} hotel={hotel} removeFromWishlist={() => removeFromWishlist(hotel)} />
          ))}
        </div>
      </div>
    </>
  )
}
