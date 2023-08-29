import React, { forwardRef, useState } from 'react';
import { imgUrl } from '../lib';
import './index.css';
import { Modal } from './Modal';

export const RoomCard = forwardRef(({ room }, ref) => {
    const { matchingRooms } = room;
    const [openModalIndex, setOpenModalIndex] = useState(-1);

    const openModal = (index) => {
        setOpenModalIndex(index);
    };

    const closeModal = () => {
        setOpenModalIndex(-1);
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

    return (
        <>
            <div ref={ref} className="room-card">
                <div className="room-details-0">
                    {matchingRooms[0]?.roomPictures?.length > 0 && (
                        <div className="image-container-2">
                            <div
                                className="img-small-1 border"
                                style={{
                                    backgroundImage: `url('${imgUrl(matchingRooms[0].roomPictures[0])}')`,
                                }}
                                onClick={() => imgUrl(matchingRooms[0].roomPictures[0])}
                            ></div>
                        </div>
                    )}
                    <h2 className="room-title">{room.title.replace(/ - \d+$/, '')}</h2>
                </div>

                <div className="room-details-10">
                    {matchingRooms[0]?.discounted_price !== 0 ? (
                        <>
                            <div className='room-price'>
                                <p className="room-discounted-price"> Rs. {matchingRooms[0].price - matchingRooms[0].discounted_price}</p>
                                <p className="room-original-price">
                                    <span className="strike-through" style={{ textDecoration: "line-through" }}> Rs. {matchingRooms[0].price}</span>
                                </p>
                            </div>
                        </>
                    ) : (
                        <p className="room-price-1"> Rs. {matchingRooms[0].price}</p>
                    )}

                    <p style={{ fontFamily: "none", marginBottom:"5px", color:"blue", display: "inline-block" }}>Capacity: <IconContainer capacity={matchingRooms[0]?.capacity} /></p>
                    
                    {
                        matchingRooms.length > 0 && (
                            <div>
                                <button className='modal-availability' onClick={() => openModal(0)}>See Availability</button>
                            </div>
                        )
                    }

                </div>
            </div>
            {matchingRooms.map((item, index) => (
                <Modal
                    key={index}
                    roomData={item}
                    isOpen={openModalIndex === index}
                    sameTitle={matchingRooms}
                    closeModal={closeModal}
                />
            ))}
        </>
    );
});
