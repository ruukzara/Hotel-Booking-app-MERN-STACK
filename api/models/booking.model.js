import { Schema, model } from "mongoose"

const Booking = model('Booking', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentDetails: [{
        cardNumber: {
            type: String,
            required: true
        }},
        {expirationDate: {
            type: String,
            required: true
        }},
    ],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
},
    {
        timestamps: true,
        required: true,
        default: true,
    }))

export default Booking;