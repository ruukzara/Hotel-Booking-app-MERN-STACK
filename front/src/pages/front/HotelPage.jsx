import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import http from '../../http';
import { imgUrl } from '../../lib';
import { Loading } from '../../components/Loading';
import { ReviewFormAndGraph, RoomCard } from '../../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css'

export const HotelPage = () => {
  const [loadingHotel, setLoadingHotel] = useState(true);
  const [hotel, setHotel] = useState({});
  const [loading, setLoading] = useState(false);
  const roomCardRef = useRef(null);
  const params = useParams()
  const [wordData, setWordData] = useState({ value: '', id: null });
  const [thumbnailsToShow, setThumbnailsToShow] = useState(4);
  const [val, setVal] = useState(0);

  const scrollToRoomCard = () => {
    if (roomCardRef.current) {
      window.scrollTo({
        top: roomCardRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleClick = (index) => {
    setVal(index);
    const clickedImage = hotel.hotelImages[index];
    setWordData({ value: clickedImage, id: index });
  };

  const handleNext = () => {
    const newIndex = val < hotel.hotelImages.length - 1 ? val + 1 : val;
    setVal(newIndex);
    const nextImage = hotel.hotelImages[newIndex];
    setWordData({ value: nextImage, id: newIndex });

    const newThumbnailsToShow = Math.min(thumbnailsToShow + 4, hotel.hotelImages.length);
    setThumbnailsToShow(newThumbnailsToShow);
  };


  const handlePrevious = () => {
    let index = val > 0 ? val - 1 : val;
    setVal(index);
    const prevImage = hotel.hotelImages[index];
    setWordData({ value: prevImage, id: index });
  };

  useEffect(() => {
    if (hotel.hotelImages && hotel.hotelImages.length > 0) {
      setWordData({ value: hotel.hotelImages[0], id: 0 });
    }
  }, [hotel.hotelImages]);


  useEffect(() => {
    const getHotel = async () => {
      setLoadingHotel(true);

      try {
        let data;
        if (params.city) {
          const { data: cityData } = await http.get(`/search/city/${params.city}`);
          data = cityData;
        } else if (params.id) {
          const { data: idData } = await http.get(`/hotel/search/${params.id}`);
          data = idData;
        }
        setHotel(data)
        setLoadingHotel(false);
      } catch (error) { }
    };
    getHotel();
  }, [params.city, params.id]);

  useEffect(() => {
    if (hotel.roomId && hotel.roomId.length > 0) {

      const fetchRoomDetails = async () => {
        const roomPromises = hotel.roomId.map(id => {
          const url = `/cms/rooms/${id}`;
          console.log('Fetching URL:', url);
          return http.get(url);
        });

        try {
          const roomResponses = await Promise.all(roomPromises);
          const roomsData = roomResponses.map(response => {
            console.log('Room Data:', response.data);
            return response.data;
          });

          setHotel(prevHotel => ({
            ...prevHotel,
            rooms: roomsData
          }));
        } catch (error) {
          console.error('Error fetching room details:', error);
        }
      };

      fetchRoomDetails();
    }
  }, []);

  const uniqueRooms = hotel.rooms?.reduce((uniqueRooms, room) => {
    const titleWithoutIndex = room.title.replace(/ - \d+$/, '').trim();

    if (!uniqueRooms.some(uniqueRoom => uniqueRoom.title === titleWithoutIndex)) {
      uniqueRooms.push({
        _id: room._id,
        title: titleWithoutIndex,
      });
    }

    return uniqueRooms;
  }, []);


  if (loadingHotel) {
    return <Loading />;
  }

  const thumbnailImages = hotel.hotelImages?.map((image, i) => ({
    value: imgUrl(image),
    id: i,

  }))

  const getSmallestPrice = (price, discounted_Price) => {
    if (typeof discounted_Price === 'number' && !isNaN(discounted_Price)) {
      return parseFloat(price) - parseFloat(discounted_Price);
    } else {
      return parseFloat(price);
    }
  };

  const CustomPrevButton_1 = ({ onClick }) => {
    return (
      <div className="third-custom-next-1" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  };

  const CustomNextButton_1 = ({ onClick }) => {
    return (
      <div className="third-custom-prev-1" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  };

  const slickSettings4 = {
    dots: true, // Display dots at the bottom for navigation
    infinite: true, // Loop the slider
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll per navigation
    prevArrow: <CustomPrevButton_1 />, // Custom previous arrow component
    nextArrow: <CustomNextButton_1 />,

    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  return (
    <>
      <div style={{ overflowY: 'hidden' }}>
        <div className='first-line' style={{ display: "flex", justifyContent: "center" }}>
          <div className="hotel-images">
            <div className='main'>
              <div className="button-container">
                <button className='btns btns-1' onClick={handlePrevious}><i className='fa-solid fa-chevron-left lefty'></i></button>
                <img src={imgUrl(wordData.value)} height="400" width="600" alt="Large Room" style={{ borderRadius: "10px" }} />
                <button className='btns btns-2' onClick={handleNext}><i className='fa-solid fa-chevron-right righty'></i></button>
              </div>
              <div className='flex_row'>
                {thumbnailImages.slice(0, Math.min(thumbnailsToShow, 4)).map((thumbnail, index) => (
                  <div className="thumbnail" key={thumbnail.id}>
                    <img
                      className={wordData.id === index ? 'clicked' : ''}
                      src={thumbnail.value}
                      onClick={() => handleClick(index)}
                      height="70"
                      width="100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="room-page">
            <h1 className="hotel-name-1">{hotel.name}</h1>
            <p className="hotel-address">Address: {hotel.address}</p>
            <p className="hotel-distance">Distance: {hotel.distance}</p>
            <p className="hotel-city">City: {hotel.city}</p>
            <p className="hotel-country">Country: {hotel.country}</p>
            <p className="hotel-price">Price starting from: ${getSmallestPrice(hotel.price)}</p>
            <div>

              <h3 className='selected-amenities'> Selected Amenities:</h3>
              <ul>

                {hotel.amenities.map((amenity, index) => (
                  <li key={index} style={{ listStyle: "none" }}>
                    {amenity.includes(',') || !amenity.includes(',') ? (
                      <ul>
                        {amenity.split(',').map((word, subIndex) => (
                          <li key={subIndex} style={{ listStyle: "none", fontWeight: "bold", fontSize: "18px", marginTop: "5px" }}>
                            <i className="fa-solid fa-right-long"></i>
                            <span >
                              {word.trim()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (<>
                      <i className="fa-solid fa-right-long"></i>
                      <span>{amenity.trim()}</span>
                    </>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-content">
                <div className="card-buttons">
                  <button className="reserve-button" onClick={scrollToRoomCard} >Choose a room </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <h2 className="rooms-heading" style={{ marginLeft: "100px" }}>About Us</h2>
        <div style={{ display: "flex" }}>
          <p className="hotel-description" style={{ marginLeft: "100px", marginTop: "-0px" }}> {hotel.description}</p>
          <ReviewFormAndGraph />
        </div>


        <div className="rooms-list-1" ref={roomCardRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <h1 className="rooms-heading">Types of rooms {hotel.name} offers</h1>
          <div className="rooms-list" style={{ display: "flex", flexDirection: "row", width: "100%", maxWidth: "1128px", flexWrap: "wrap" }}>
            {uniqueRooms.map((uniqueRoom, index) => {
              // Filter rooms with matching title
              const roomsWithMatchingTitle = hotel.rooms.filter((room) =>
                room.title.includes(uniqueRoom.title)
              );

              // Combine the details of matching rooms
              const combinedRoom = {
                ...uniqueRoom, // Unique details
                matchingRooms: roomsWithMatchingTitle, // List of matching rooms
              };

              return (
                <div key={combinedRoom._id}>
                  <RoomCard room={combinedRoom} />
                </div>
              );
            })}
          </div>
        </div>

      </div >
    </>
  );
};
