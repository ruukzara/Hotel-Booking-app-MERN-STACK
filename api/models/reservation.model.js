import { Schema, model } from "mongoose"

const Reservation = model('Reservation', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guests: Number,
    status: {
        type: Boolean,
        required: true,
    }
},
    {
        timestamps: true,
        required: true,
        default: true,
    }))

export default Reservation