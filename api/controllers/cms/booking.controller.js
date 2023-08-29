import mongoose from 'mongoose';
import { anyError } from '../../lib/index.js';
import { Booking, OrderDetails } from '../../models/index.js'


class bookingController {

    // Create a new booking
    getBookings = async (req, res, next) => {
        try {
            const bookings = await Booking.aggregate([
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }
            ]).exec()

            let result = []

            for (let order of bookings) {
                let details = await OrderDetails.aggregate([
                    { $match: { BookingId: new mongoose.Types.ObjectId(order._id) } },
                    { $lookup: { from: 'hotels', localField: 'hotelId', foreignField: '_id', as: 'hotel' } }
                ]).exec()
                details = details.map(detail => {
                    return {
                        _id: detail._id,
                        hotelId: detail.hotelId[0],
                        roomId: detail.roomId[0],
                        BookingId: detail.BookingId,
                        checkInDate: detail.checkInDate,
                        checkOutDate: detail.checkOutDate,
                        guests: detail.guests,
                        roomPrice: detail.roomPrice,
                        totalPrice: detail.totalPrice,
                        createdAt: detail.createdAt,
                        updatedAt: detail.updatedAt,
                        __v: detail.__v
                    }
                })
                result.push({
                    _id: order._id,
                    hotelId: order.hotelId,
                    roomId: order.roomId,
                    details: details,
                    paymentDetails: order.paymentDetails,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    __v: order.__v
                })

            }

            res.json(bookings)
        } catch (err) {
            anyError(err, next)
        }
    }

    //update a booking
    update = async (req, res, next) => {
        try {
            const { paymentDetails, status } = req.body

            await Booking.findByIdAndUpdate(req.params.id, { status, paymentDetails })

            res.json({
                success: 'Booking Updated.'
            })
        } catch {
            showError(err, next)
        }
    }

    // Delete a booking
    deleteBooking = async (req, res, next) => {
        try {
            const bookingId = req.params.id;

            // Check if the booking exists
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found.' });
            }

            // Delete the booking
            await Booking.findByIdAndDelete(bookingId);

            res.json({ success: 'Booking deleted.' });
        } catch (error) {
            next(error);
        }
    };
}

export default new bookingController
