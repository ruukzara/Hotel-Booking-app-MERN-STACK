import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [hotel, setHotel] = useState(false)


    const loadData = () => {
        setLoading(true)
        http.get('/cms/reviews')
            .then(({ data }) => setReviews(data))
            .catch(error => { })
            .finally(setLoading(false))
    }

    const getHotel = () => {
        setLoading(true)
        http.get(`/cms/hotels`)
            .then(({ data }) => setHotel(data))
            .catch(error => { })
            .finally(setLoading(false))
    }


    useEffect(() => {
        loadData()
        getHotel()
    }, [])

    const handleDelete = id => confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do delete this?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    setLoading(true)

                    http.delete(`/cms/reviews/${id}`)
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



    return <>
        <div className="reviews-header">
            <div className="edit-reviews">
                <h1> Reviews </h1>
            </div>
            <div className="reviews-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Slug', 'Created At',
                        'Updated At']} searchable={['Name', 'Slug', 'Status', 'Created At',
                            'Updated At'
                        ]} data={reviews.map(review => {
                            return {
                                'Username': review.user.name,
                                'HotelName': review.hotelId,
                                'Comment': review.comments,
                                'Ratings': review.rating,
                                'Created At': dtFormat(review.createdAt),
                                'Updated At': dtFormat(review.updatedAt),
                                'Actions': <>
                                    <button type="button" onClick={() => handleDelete(review._id)} className="delete-button">
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
