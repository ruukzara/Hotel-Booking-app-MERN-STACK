import mongoose, { Schema, model } from "mongoose"

const OrderDetails = model('OrderDetails', new Schema({
    BookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    roomPrice: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true,
        required: true,
        default: true,
    }))

export default OrderDetails
