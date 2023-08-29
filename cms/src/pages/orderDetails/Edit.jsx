import React, { useState, useEffect } from "react";
import "./index.css";
import { getDaysNumbers, isNull, setInState } from "../../lib";
import { SubmitButton } from "../../components";
import http from "../../http";
import { useNavigate, useParams } from "react-router-dom";

export const Edit = () => {

    const [loginForm, setLoginForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});

    const navigate = useNavigate();
    const params = useParams()

    const handleChange = (ev) => {
        const { name, value } = ev.target;
        setLoginForm((prevLoginForm) => ({
            ...prevLoginForm,
            [name]: value,
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        setLoading(true);
        http
            .get(`/cms/orderdetails/${params.id}`)
            .then(({ data }) => {
                const formattedOrderDetails = {
                    ...data.orderDetail,
                    checkInDate: formatDate(data.orderDetail.checkInDate),
                    checkOutDate: formatDate(data.orderDetail.checkOutDate),
                };
                setOrderDetails(formattedOrderDetails);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [params.id]);
    


    useEffect(() => {
        if (!isNull(orderDetails)) {
            setLoginForm({
                BookingId: orderDetails.BookingId,
                hotelId: orderDetails.hotelId,
                roomId: orderDetails.roomId,
                userId: orderDetails.userId,
                checkInDate: orderDetails.checkInDate,
                checkOutDate: orderDetails.checkOutDate,
                guests: orderDetails.guests,
                quantity: orderDetails.quantity,
                roomPrice: orderDetails.roomPrice,
                totalPrice: orderDetails.totalPrice,
            });
        }
    }, [orderDetails]);

    useEffect(() => {
        if (loginForm.roomPrice && loginForm.checkInDate && loginForm.checkOutDate && loginForm.quantity) {
            const numberOfDays = getDaysNumbers(loginForm.checkInDate, loginForm.checkOutDate);
            const totalPrice = loginForm.roomPrice * numberOfDays * loginForm.quantity;
            setLoginForm((prevData) => ({
                ...prevData,
                totalPrice, // Update totalPrice in the loginForm state
            }));
        }
    }, [loginForm.roomPrice, loginForm.checkInDate, loginForm.checkOutDate, loginForm.quantity]);

    const handleSubmit = (ev) => {

        ev.preventDefault();
        setLoading(true);

        http
            .patch(`/cms/orderdetails/${params.id}`, loginForm)
            .then(() => navigate("/cms/orderdetails"))
            .catch((error) => { })
            .finally(() => setLoading(false));
    };

    return <>
        <div className="create-login-form">
            <h2 className="create-label"> Edit Order Details </h2>

            <form className="create-form" onSubmit={handleSubmit}>
                <div className="name-input">
                    <label htmlFor="BookingId">Booking ID:</label>
                    <input
                        type="text"
                        id="BookingId"
                        name="BookingId"
                        defaultValue={loginForm.BookingId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="hotelId">Hotel ID:</label>
                    <input
                        type="text"
                        id="hotelId"
                        name="hotelId"
                        defaultValue={loginForm.hotelId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="roomId">Room ID:</label>
                    <input
                        type="text"
                        id="roomId"
                        name="roomId"
                        defaultValue={loginForm.roomId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        defaultValue={loginForm.userId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="checkInDate">Check-in Date:</label>
                    <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        defaultValue={loginForm.checkInDate}
                        onChange={handleChange}
                        style={{ width: "350px" }}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="checkOutDate">Check-out Date:</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        defaultValue={loginForm.checkOutDate}
                        onChange={handleChange}
                        style={{ width: "350px" }}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="guests">Guests:</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        defaultValue={loginForm.guests}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        defaultValue={loginForm.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="roomPrice">Room Price:</label>
                    <input
                        type="number"
                        id="roomPrice"
                        name="roomPrice"
                        defaultValue={loginForm.roomPrice}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="totalPrice">Total Price:</label>
                    <input
                        type="number"
                        id="totalPrice"
                        name="totalPrice"
                        defaultValue={loginForm.totalPrice}
                        onChange={handleChange}
                        disabled
                        required
                    />
                </div>
                <div className="submit-input">
                    <SubmitButton disabled={loading} />
                </div>
            </form>
        </div>
    </>
}

