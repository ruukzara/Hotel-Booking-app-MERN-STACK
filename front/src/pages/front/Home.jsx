import React, { useEffect, useMemo, useState } from 'react'
import http from "../../http"
import { Footer, HotelCard } from '../../components'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HotelCityCard } from '../../components/HotelCityCard';
import { clearStorage, imgUrl } from '../../lib';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks';
import { Search } from '../../components';

export const Home = () => {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState([])
  const [category, setCategory] = useState([])
  const [categoryHotels, setCategoryHotels] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [wishlist, setWishlist] = useState([])

  const { data, loadings, error } = useFetch(`/hotel/countbytype?categories= Hotels,Villas,Apartments,Motels,Resorts,Hostels`)

  const CustomPrevButton = ({ onClick }) => {
    return (
      <div className="custom-prev-button" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  };

  const CustomNextButton = ({ onClick }) => {
    return (
      <div className="custom-next-button" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  };

  const SecondPrevButton = ({ onClick }) => {
    return (
      <div className="second-custom-prev" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  };

  const SecondNextButton = ({ onClick }) => {
    return (
      <div className="second-custom-next" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  };
  const ThirdPrevButton = ({ onClick }) => {
    return (
      <div className="third-custom-next" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  };

  const ThirdNextButton = ({ onClick }) => {
    return (
      <div className="third-custom-prev" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  };

  const slickSettings1 = {
    dots: true, // Display dots at the bottom for navigation
    infinite: true, // Loop the slider
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 5, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll per navigation
    prevArrow: <CustomPrevButton />, // Custom previous arrow component
    nextArrow: <CustomNextButton />,

    responsive: [
      {
        breakpoint: 1200, // Default breakpoint for larger screens
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992, // Default breakpoint for medium-sized screens
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, // Default breakpoint for tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576, // Default breakpoint for mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const slickSettings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: <SecondPrevButton />,
    nextArrow: <SecondNextButton />,
    responsive: [
      {
        breakpoint: 1200, // Default breakpoint for larger screens
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992, // Default breakpoint for medium-sized screens
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 780, // Default breakpoint for tablets
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 660, // Default breakpoint for tablets
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 576, // Default breakpoint for mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const slickSettings3 = {
    dots: false, // Display dots at the bottom for navigation
    infinite: true, // Loop the slider
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll per navigation
    prevArrow: <ThirdPrevButton />, // Custom previous arrow component
    nextArrow: <ThirdNextButton />,

    responsive: [
      {
        breakpoint: 1200, // Default breakpoint for larger screens
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992, // Default breakpoint for medium-sized screens
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Default breakpoint for tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576, // Default breakpoint for mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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


  const hotelsByCity = city.reduce((acc, hotel) => {
    if (!acc[hotel.city]) {
      acc[hotel.city] = [];
    }
    acc[hotel.city].push(hotel);
    return acc;
  }, {});

  // Convert the object back to an array
  const uniqueHotels = Object.values(hotelsByCity);

  const handleSubscribe = () => {
    setSubscribed(true);
  };

  const [selectedCity, setSelectedCity] = useState('');

  const handleHotelCityCardClick = (cityName) => {
    setSelectedCity(cityName);
  };

  // Use useMemo to filter the uniqueHotels based on the selected city
  const filteredHotels = useMemo(() => {
    if (!selectedCity) {
      return uniqueHotels;
    } else {
      return uniqueHotels.filter((hotelGroup) => hotelGroup[0].city === selectedCity);
    }
  }, [selectedCity, uniqueHotels]);

  return <>
    <div style={{ overflowY: "hidden" }}>

      <div className='search-home'>
        <Search />
      </div>
      <div className="home-container"></div>
      <div className='bycity-heading'>
        <h2>Search Popular Destination By Cities </h2>
      </div>

      <div className="slider-container">
        <Slider {...slickSettings1} >
          {uniqueHotels.map((hotelGroup, index) => (
            <div key={index}>
              <Link to={`/search`} style={{ textDecoration: 'none' }}>
                <HotelCityCard hotel={hotelGroup[0]} onClick={() => handleHotelCityCardClick(hotelGroup[0].city)}
                />
                <h3 className='city-name'>{hotelGroup[0].city}</h3>
                <p className='city-length'>{hotelGroup.length} {hotelGroup.length <= 1 ? 'property' : 'properties'}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <div>
        <div className='bycity-heading'>
          <h2> Remarkable Stays: Unrivaled Luxury at Exceptional Hotels </h2>
        </div>
        <div className='third-slider'>
          <Slider {...slickSettings3} >
            {featured.map((hotel, index) => (
              <div key={index} >
                <Link to={'/search'} style={{ textDecoration: 'none' }}>
                  <HotelCard key={hotel._id}
                    hotel={hotel}
                    onAddToWishlist={() => addToWishlist(hotel)}
                    onRemoveFromWishlist={() => removeFromWishlist(hotel)}
                    isWishlistItem={wishlist.some(item => item._id === hotel._id)}
                  /></Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>


      <div style={{ marginBottom: "40px" }}>
        <div className='bycity-heading'>
          <h2> Browse by property type </h2>
        </div>
        <div style={{ margin: "auto 40px auto 70px", gap: "20px", overflow: 'hidden' }}>
          <Slider {...slickSettings2} >
            {category.map((categoryHotel, index) => (
              <Link key={index} to={'/search'} style={{ textDecoration: "none !important" }}>
                <div >
                  <div className="hotel-card">
                    <div className="hotel-image-container">
                      <p className="hotel-location">{categoryHotel.city}</p>
                      {categoryHotel.images && categoryHotel.images[0] && (
                        <img src={imgUrl(categoryHotel.images[0])} alt={categoryHotel.name} className="hotel-image" />
                      )}
                    </div>
                    <div className="hotel-details">
                      <h2 className="hotel-name">{categoryHotel.name}</h2>
                      <p style={{ textDecoration: "none" }}>
                        {data[index]} {data[index] <= 1 ? 'property' : 'properties'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      </div>

      <Footer />

    </div>
  </>
}

