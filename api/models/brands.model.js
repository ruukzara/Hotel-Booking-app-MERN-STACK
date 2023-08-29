import { Schema, model } from "mongoose"

const Brand = model('Brand', new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required:true,
        default:true,
    },
},
    {
        timestamps: true,
        required: true,
        default: true,
    }))


export default Brand;
