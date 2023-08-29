import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const [hotel, setHotel] = useState(false)

    const loadData = () => {
        setLoading(true)
        http.get('/cms/bookings')
            .then(({ data }) => {
                setBookings(data)
            })
            .catch(error => { })
            .finally(setLoading(false))
    }

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        setLoading(true);
        http.get('/cms/hotels')
            .then(({ data }) => {
                setHotel(data);
                console.log(data)
            })
            .catch((error) => { })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = id => confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do delete this?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    setLoading(true)

                    http.delete(`/cms/bookings/${id}`)
                        .then(() => loadData())
                        .catch(error => { })
                        .finally(() => setLoading(false))
                }
            },
            {
                label: 'No',
                onClick: () => { }
            }
        ]
    })

    const handleUpdate = (id, status) => {
        setLoading(true)

        http.patch(`/cms/bookings/${id}`, { status })
            .then(({ data }) => loadData())
            .catch(error => { })
            .finally(setLoading(false))
    }

    return <>
        <div className="reviews-header">
            <div className="rooms-list">
                <div className="rooms-list-header">
                    <h1> Bookings </h1>
                </div>
            </div>

            <div className="reviews-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'User Id', 'Created At',
                        'Updated At']} searchable={['Name', 'Slug', 'Status', 'Created At',
                            'Updated At'
                        ]} data={bookings.map(booking => {
                            return {
                                'User Id': booking.user.name || booking.userId,
                                'Card Details': booking.paymentDetails.cardNumber,
                                'Status': <select
                                    defaultValue={booking.status}
                                    onChange={ev => handleUpdate(booking._id, ev.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>,
                                'Created At': dtFormat(booking.createdAt),
                                'Updated At': dtFormat(booking.updatedAt),
                                'Actions': <>
                                    <button type="button" onClick={() => handleDelete(booking._id)} className="delete-button">
                                        <i className="fa-solid fa-trash" title="Delete" style={{ backgroundColor: "#C70039" }}></i>
                                    </button>
                                </>
                            }
                        })} />
                }
            </div>
        </div>
    </>
}
