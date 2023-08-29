import { Schema, model } from "mongoose"

const Category = model('Category', new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    hotelImages: {
        type: [String],
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
}))

export default Category