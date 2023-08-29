
import React, { useEffect, useState } from "react";
import { DataTable, Loading } from "../../components";
import { dtFormat } from "../../lib";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import http from "../../http";
import { Link } from "react-router-dom";

export const List = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [dataHotel, setDataHotel] = useState(undefined);
    const [loading, setLoading] = useState(false);


    const handleDelete = (id) =>
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setLoading(true);

                        http.delete(`/cms/orderdetails/${id}`)
                            .then(() => loadData())
                            .catch((err) => { })
                            .finally(() => setLoading(false));
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });

    const handleUpdate = (id, status) => {
        setLoading(true);
        http.patch(`/cms/orderdetails/${id}`, { status })
            .then(() => loadData())
            .catch((err) => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [orderDetailsRes, hotelsRes] = await Promise.all([
                    http.get('/cms/orderdetails'),
                    http.get('/cms/hotels')
                ]);

                setOrderDetails(orderDetailsRes.data);
                const hotelData = hotelsRes.data.reduce((acc, hotel) => {
                    acc[hotel._id] = hotel
                    return acc;
                }, {});
                setDataHotel(hotelData);

                setLoading(false);
            } catch (error) {
                console.log('Error loading data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return <>
        <div className="rooms-header">
            <div className="rooms-list">
                <div className="rooms-list-header">
                    <h1> Order Details </h1>
                </div>

                <div className="add-room-button">
                    <Link to="/cms/orderdetails/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add Order Details
                        </button>
                    </Link>
                </div>
            </div>
            <div className="rooms-data">
                {loading ? (
                    <Loading />
                ) : (
                    <DataTable
                        sortable={['User', 'Check-in Date', 'Check-out Date', 'Guests', 'Room Price', 'Total Price', 'Created At', 'Updated At']}
                        searchable={['User', 'Check-in Date', 'Check-out Date', 'Guests', 'Room Price', 'Total Price', 'Created At', 'Updated At']}
                        data={orderDetails.map(orderDetail => {
                            const hotelData = dataHotel && dataHotel[orderDetail.hotelId];
                            const price = hotelData?.price;
                            const name = hotelData?.name;

                            return {
                                'Name': name,
                                'Check-in Date': dtFormat(orderDetail.checkInDate),
                                'Check-out Date': dtFormat(orderDetail.checkOutDate),
                                'Guests': orderDetail.guests,
                                'Room Price': price || 0,
                                'Total Price': orderDetail.totalPrice || 0,
                                'Created At': dtFormat(orderDetail.createdAt),
                                'Updated At': dtFormat(orderDetail.updatedAt),
                                'Actions': <>
                                    <Link to={`/cms/orderdetails/${orderDetail._id}`} className="edit-all edit-rooms">
                                        <i className="fa-solid fa-edit" title="Edit"></i>
                                    </Link>
                                    <button
                                        type="button"
                                        className="delete-button"
                                        title="Delete"
                                        onClick={() => handleDelete(orderDetail._id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </>
                            };
                        })}
                    />
                )}
            </div>
        </div>
    </>
}

