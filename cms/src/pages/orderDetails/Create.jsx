import React, { useState, useEffect } from "react";
import "./index.css";
import { getDaysNumbers, setInState } from "../../lib";
import { SubmitButton } from "../../components";
import http from "../../http";
import { useNavigate } from "react-router-dom";

export const Create = () => {

    const [bookingForm, setBookingForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [hotel, setHotel] = useState({});

    const navigate = useNavigate();

    const handleChange = (ev) =>
        setInState(ev, bookingForm, setBookingForm);

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        http
            .post("/cms/orderdetails", bookingForm)
            .then(() => navigate("/cms/orderdetails"))
            .catch((error) => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setLoadingForm(true);
        http
            .get("/cms/hotels")
            .then(({ data }) => {
                // Assuming you get a single hotel object from the API, update the state accordingly
                setHotel((prevData) => ({
                    ...prevData,
                    hotelId: data._id,
                    roomPrice: data.price,
                }))
            })
            .catch((error) => console.error("Error fetching hotel data:", error))
            .finally(() => setLoadingForm(false));
    }, [])

    useEffect(() => {
        if (bookingForm.roomPrice && bookingForm.checkInDate && bookingForm.checkOutDate && bookingForm.quantity) {
          const numberOfDays = getDaysNumbers(bookingForm.checkInDate, bookingForm.checkOutDate);
          const totalPrice = bookingForm.roomPrice * numberOfDays * bookingForm.quantity;
          setBookingForm((prevData) => ({
            ...prevData,
            totalPrice, // Update totalPrice in the bookingForm state
          }));
        }
      }, [bookingForm.roomPrice, bookingForm.checkInDate, bookingForm.checkOutDate, bookingForm.quantity]);

    return <> <div className="create-login-form">
            <h2 className="create-label"> Order Details </h2>

            <form className="create-form" onSubmit={handleSubmit}>
                <div className="name-input">
                    <label htmlFor="bookingId">Booking ID:</label>
                    <input
                        type="text"
                        id="bookingId"
                        name="bookingId"
                        value={bookingForm.bookingId}
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
                        value={bookingForm.hotelId}
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
                        value={bookingForm.roomId}
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
                        value={bookingForm.userId}
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
                        value={bookingForm.checkInDate}
                        onChange={handleChange}
                        style={{width:"350px"}}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="checkOutDate">Check-out Date:</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={bookingForm.checkOutDate}
                        onChange={handleChange}
                        style={{width:"350px"}}
                        required
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="guests">Guests:</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={bookingForm.guests}
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
                        value={bookingForm.quantity}
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
                        value={bookingForm.roomPrice}
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
                        value={bookingForm.totalPrice}
                        onChange={handleChange}
                        read-only
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
    
