import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat, imgUrl } from "../../lib"

export const List = () => {
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(false)

    const loadData = () => {
        setLoading(true)
        http.get('/cms/hotels')
            .then(({ data }) => {
                setHotels(data)
            })
            .catch(error => { })
            .finally(setLoading(false))
    };

    useEffect(() => {
        loadData()
    }, []);


    const handleDelete = id => confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure you want to delete this?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    setLoading(true);

                    http.delete(`/cms/hotels/${id}`)
                        .then(() => {
                            loadData()
                        })
                        .catch(error => {
                            // Handle the error condition here
                            console.error('Error deleting hotel:', error);
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

    const handleDeleteRoom = async (hotelId, roomId) => {
        try {
          const response = await http.delete(`/cms/hotels/${hotelId}/rooms/${roomId}`);
          window.location.reload();

        } catch (error) {
          console.error('Error deleting room:', error);
        }
      };

      const getSmallestPrice = () => {
        if (typeof Discounted_Price === 'number' && !isNaN(Discounted_Price)) {
            return parseFloat(price) - parseFloat(Discounted_Price);
        } else {
            return parseFloat(price);
        }
    };

    return <>
        <div className="hotels-header">
            <div className="hotels-list">
                <div className="hotels-list-header">
                    <h1> Hotels </h1>
                </div>

                <div className="add-hotel-button">
                    <Link to="/cms/hotels/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add Hotel
                        </button>
                    </Link>
                </div>
            </div>

            <div className="hotels-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Slug', 'City', 'Country', 'Created At',
                        'Updated At']} searchable={['Name', 'Slug', 'Status', 'City', 'Country', 'Created At',
                            'Updated At'
                        ]} data={hotels.map(hotel => {
                            return {
                                'Name': hotel.name,
                                'City': hotel.city,
                                'Price': hotel.price - hotel.Discounted_Price,
                                'Room': (
                                    <ul>
                                      {hotel.room.map((room) => (
                                        <li key={room._id} style={{listStyle:"none"}}>
                                          <p>{room.title}&nbsp;<button style={{color: "red"}} onClick={() => handleDeleteRoom(hotel._id, room._id)}>X</button></p>
                                        </li>
                                      ))}
                                    </ul>
                                  ),
                                'Hotel Image': (
                                    <a href={hotel.hotelImages && hotel.hotelImages[0] && imgUrl(hotel.hotelImages[0])} target="_blank">
                                        {hotel.hotelImages && hotel.hotelImages[0] && (
                                            <img
                                                src={imgUrl(hotel.hotelImages[0])}
                                                style={{ height: "60px", width: "100px" }}
                                            />
                                        )}
                                    </a>
                                ),
                                'Room Image': (
                                    <a href={hotel.roomImages && hotel.roomImages[0] && imgUrl(hotel.roomImages[0])} target="_blank">
                                        {hotel.roomImages && hotel.roomImages[0] && (
                                            <img
                                                src={imgUrl(hotel.roomImages[0])}
                                                style={{ height: "60px", width: "100px" }}
                                            />
                                        )}
                                    </a>
                                ),
                                'Status': hotel.status ? 'Active' : 'Inactive',
                                'Featured': hotel.featured ? 'Yes' : 'No',
                                'Created At': dtFormat(hotel.createdAt),
                                'Updated At': dtFormat(hotel.updatedAt),
                                'Actions': <>
                                <div style={{display:"flex", justifyContent:"center"}}>
                                    <Link to={`/cms/hotels/${hotel._id}`} className="edit-all">
                                        <i className="fa-solid fa-edit" title="Edit"></i>
                                    </Link>
                                    <button type="button" onClick={() => handleDelete(hotel._id)} className="delete-button translate-delete-btn">
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
