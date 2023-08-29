import { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link, useParams } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat, imgUrl } from "../../lib"
import React from 'react';
import { format } from 'date-fns';


export const List = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(false)
    const [dates, setDates] = useState([]); // Add state for unavailDates
    const [hotels, setHotels] = useState([]); // Add state for hotels

    const loadData = async () => {
        setLoading(true);
        try {
            const roomsResponse = await http.get('/cms/rooms');
            const roomsData = roomsResponse.data;

            setRooms(roomsData);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = (id, hotelId) => confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to delete this room?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    setLoading(true);

                    http.delete(`/cms/rooms/${hotelId}/${id}`)
                        .then(() => {

                            loadData();
                        })
                        .catch(error => {
                            console.error('Error deleting room:', error);
                        })
                        .finally(() => setLoading(false));
                }
            },
            {
                label: 'No',
                onClick: () => { }
            }
        ]
    });

    const handleDeleteBtn = async (roomId, roomNumberIndex, unavailDate) => {
        try {
            const formattedDate = format(new Date(unavailDate), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            
            const deleteUrl = `/cms/rooms/delete-dates/${roomId}/${roomNumberIndex}/${encodeURIComponent(formattedDate)}`;
            await http.delete(deleteUrl);

            loadData();
            
        } catch (error) {
            console.error('Error deleting unavailDate:', error);
        }
    };    
    

    useEffect(() => {
        async function fetchHotels() {
            setLoading(true);
            try {
                const hotelsResponse = await http.get('/cms/hotels');
                setHotels(hotelsResponse.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHotels();
    }, []);


    return <>
        <div className="rooms-header">
            <div className="rooms-list">
                <div className="rooms-list-header">
                    <h1> Rooms </h1>
                </div>

                <div className="add-room-button">
                    <Link to="/cms/rooms/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add room
                        </button>
                    </Link>
                </div>
            </div>

            <div className="rooms-data">
                {loading ?
                    <Loading /> :
                    <DataTable
                        sortable={['Hotel Name', 'Title', 'Price', 'Room Number/UnavailDates', 'Capacity', 'Amenities', 'Created At', 'Updated At']}
                        searchable={['Hotel Name', 'Title', 'Price', 'Room Number/UnavailDates', 'Amenities', 'Capacity', 'Created At', 'Updated At']}
                        data={rooms.map((room, index) => {
                            const hotelWithMatchingRoom = hotels.find(hotel => 
                                hotel.room.some(roomInHotel => roomInHotel._id === room._id)
                            );
                        
                            const hotelName = hotelWithMatchingRoom ? hotelWithMatchingRoom.name : 'Unknown Hotel';

                            const roomNumbers = room.roomNumbers && room.roomNumbers.length > 0
                                ? room.roomNumbers.map(roomData => ({
                                    number: roomData.number,
                                    unavailDates: roomData.unavailDates ? roomData.unavailDates.map(date => dtFormat(date)) : []
                                }))
                                : [];


                            const roomNumberDivs = roomNumbers.map((roomData, index) => (
                                <div className="roomContainer" key={index}>
                                    {roomData && (
                                        <div className="roomBox">
                                            <div className="roomNumber">{roomData.number}</div>
                                            <div className="unavailDates">
                                                {roomData.unavailDates.map((date, dateIndex) => (
                                                    <div key={date} style={{ display: "flex" }}>
                                                        <div>{date}</div>
                                                        <button onClick={() => handleDeleteBtn(room._id, index, dateIndex)}>Delete</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ));

                            return {
                                'Hotel Name':hotelName,
                                'Title': room.title,
                                'Room Number/UnavailDates': roomNumberDivs,
                                'Price': room.price - room.discounted_price,
                                'Room Image': (
                                    <a href={room.roomPictures && room.roomPictures[0] && imgUrl(room.roomPictures[0])} target="_blank">
                                        {room.roomPictures && room.roomPictures[0] && (
                                            <img
                                                src={imgUrl(room.roomPictures[0])}
                                                style={{ height: "60px", width: "100px" }}
                                            />
                                        )}
                                    </a>
                                ),
                                'Capacity': room.capacity,
                                'Amenities': room.amenities,
                                'Created At': dtFormat(room.createdAt),
                                'Updated At': dtFormat(room.updatedAt),
                                'Actions': <>
                                <div className="edit-all-rooms">
                                    <Link to={`/cms/rooms/${room._id}`} className="edit-all edit-rooms">
                                        <i className="fa-solid fa-edit" title="Edit"></i>
                                    </Link>
                                    <button type="button"
                                        onClick={() => handleDelete(room._id, room.hotelId)} className="delete-button">
                                        <i className="fa-solid fa-trash" title="Delete" style={{ backgroundColor: "#C70039" }}></i>
                                    </button>
                                    </div>
                                </>
                            }
                        })} />
                }
            </div>
        </div>
    </>
}








