import { Schema, model } from "mongoose"

const Review = model('Review', new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    hotelId: {
        type: Schema.Types.ObjectId,
        ref: 'hotels',
        required: true
    },
    rating: {
        type: String,
        required: true,
        min: 1,
        max: 5,
    },
    comments: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        required: true,
        default: true,
    }))

export default Review;