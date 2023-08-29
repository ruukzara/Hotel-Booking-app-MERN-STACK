import React, { useContext, useState } from 'react';
import './Modal.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { imgUrl, isNull } from '../lib';
import { SearchContext } from '../useContext/SearchContext';
import http from '../http';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const Modal = ({ sameTitle, roomData, isOpen, closeModal }) => {
    const [selectedRooms, setSelectedRooms] = useState([])
    const { dates, options } = useContext(SearchContext);
    const [errorMessage, setErrorMessage] = useState('');

    const user = useSelector(st => st.user.value)

    const getAllDates = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const date = new Date(start.getTime());

        const dates = [];

        while (date <= end) {
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[1]);

    const allDates = getAllDates(startDate, endDate)

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailDates.some(date => {
            return allDates.includes(new Date(date).getTime());
        });
        return !isFound;
    }

    const getNumberOfDays = (start_date, end_date) => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const timeDifference = Math.abs(end - start);
        const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return numberOfDays;
    };

    const start_date = dates[0];
    const end_date = dates[1];

    const numberOfDays = getNumberOfDays(start_date, end_date);
    const totalPrice = numberOfDays * roomData.price * options.room;

    const titleWithoutIndex = roomData?.title.replace(/ - \d+$/, '').trim();

    const handleSelect = (ev) => {

        const checked = ev.target.checked
        const value = ev.target.value

        setSelectedRooms(
            checked
                ? [...selectedRooms, value]
                : [selectedRooms.filter((item) => item !== value)]
        )
    }


    const handleReserve = async () => {
        if (selectedRooms.length === 0 || allDates.length === 0) {
            setErrorMessage("Please select at least one room and one date before reserving.");
            return;
        }

        try {
            await Promise.all(selectedRooms.map(async (roomNumberId) => {
                const res = await http.put(`/cms/rooms/availability/${roomNumberId}`, {
                    dates: allDates,
                });
                return res.data;
            }));
        } catch (err) { }
    };


    if (!isOpen) {
        return null;
    }

    const closeModalInternal = (e) => {
        e.stopPropagation();
        closeModal();
    };



    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-center">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-button" onClick={closeModalInternal}>
                        <i className="fa-solid fa-square-xmark " style={{ fontSize: "42px" }}></i>
                    </button>
                    <h1 className="modal-title">{titleWithoutIndex}</h1>
                    <div className="modal-body">
                        <br />
                        <Carousel showThumbs={false}>
                            {roomData.roomPictures.map((image, index) => (
                                <div key={index}>
                                    <img src={imgUrl(image)} alt={`Image ${index}`} height={300} width={300} />
                                </div>
                            ))}
                        </Carousel>

                        <div style={{ marginTop: "20px", textAlign: "justify-all" }}>
                            {roomData.desc}
                        </div>

                        <div className="modal-footer">
                            <div className="amenities">
                                <p style={{ fontWeight: "bold", fontSize: "16px", marginTop: "5px", marginBottom: "10px" }}> Amenities:</p>
                                <div>
                                    {roomData?.amenities && (
                                        <ul>
                                            {roomData.amenities.map((amenity, index) => (
                                                <li key={index} style={{ listStyle: "none" }}>
                                                    {amenity.includes(',') || !amenity.includes(',') ? (
                                                        <ul>
                                                            {amenity.split(',').map((word, subIndex) => (
                                                                <li key={subIndex} style={{ listStyle: "none", fontWeight: "bold", fontSize: "14px", marginBottom: "10px" }}>
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
                                    )}
                                </div>
                            </div>

                            <div className="price-info card">
                                <p className="price-label">
                                    Total Price for <i style={{ color: "blue" }}>{options.room || 1} room{options.room <= 1 ? 's' : ''} and {numberOfDays || 1}{' '}
                                        day{numberOfDays <= 1 ? 's' : ''}</i> becomes <i style={{ color: "blue" }}>Rs. {totalPrice || (1 * roomData.price * 1)}</i>
                                </p>
                                <p style={{ fontFamily: "initial", fontSize: "16px", marginTop: "5px", color: "red" }}>If you agree on this price then choose the room numbers to reserve the room!!</p>
                            </div>

                            <div className="room-numbers">
                                <p style={{
                                    fontWeight: "bold", fontSize: "16px", margin: "auto 30px 5px auto"
                                }}>
                                    Room Numbers:</p>
                                {sameTitle.map((room, index) => (
                                    <label key={index} className="room-number">
                                        {room.roomNumbers[0].number} <br />
                                        <input
                                            type="checkbox"
                                            value={room.roomNumbers[0]._id}
                                            onChange={handleSelect}
                                            disabled={!isAvailable(room.roomNumbers[0])}
                                        />

                                    </label>
                                ))}
                                {errorMessage && (
                                    <div className="error-message-1" style={{ color: "red", fontSize: "12px" }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <br />
                                {isNull(user) ?
                                    <Link to="/login">
                                        <button className="reserve-button">Reserve</button>
                                    </Link>
                                    :
                                    <button className="reserve-button" onClick={handleReserve}>
                                        Reserve
                                    </button>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
