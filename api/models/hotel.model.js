import mongoose, { Schema, model } from "mongoose"

const Hotel = model('Hotel', new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
  },
  hotelImages: {
    type: [String],
    required: true,
  },
  roomImages: {
    type: [String],
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  Discounted_Price:{
    type: Number,
  },
  status: {
    type: Boolean,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  roomId: [{
    type: Schema.Types.ObjectId,
    ref: 'Room',
  }],

  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Categorys',
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brands',
    default: null,
  },
  breakfastIncluded: {
    type: Boolean,
    default: false,
  },
  pool: {
    type: Boolean,
    default: false,
  },
  freeCancellation: {
    type: Boolean,
    default: false,
  },
  noPrepayment: {
    type: Boolean,
    default: false,
  },
  airportPickup: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
}))

export default Hotel;
