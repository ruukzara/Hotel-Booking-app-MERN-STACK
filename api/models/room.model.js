import { Schema, model } from "mongoose"

const Room = model('Room', new Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discounted_price: {
    type: Number,
    required: true,
  },
  roomNumbers: [{number: Number, unavailDates: {type: [Date]} }],
  capacity: {
    type: Number,
    required: true
  },
  amenities: [String],
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  roomPictures: {
    type: [String],
    required: true,
  },
},
  {
    timestamps: true,
    required: true,
    default: true,
  }))

export default Room;