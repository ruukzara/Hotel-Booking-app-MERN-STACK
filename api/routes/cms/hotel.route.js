import express from "express"
import { Cms } from "../../controllers/index.js"
import { adminOnly, fileUpload } from "../../lib/index.js"

const router = express.Router()

const mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

const uploadFields = fileUpload(mimes).fields([
    { name: 'hotelImages', maxCount: 10},
    { name: 'roomImages', maxCount: 10 }
  ]);
  

router.route('/')
    .get(Cms.Hotels.getAllHotels)
    .post(uploadFields, adminOnly, Cms.Hotels.newHotel, adminOnly);
router.route('/:id')
    .get(Cms.Hotels.getHotel)
    .put(uploadFields, Cms.Hotels.updateHotel, adminOnly)
    .patch(uploadFields, Cms.Hotels.updateHotel, adminOnly)
    .delete(Cms.Hotels.deleteHotel, adminOnly)

router.delete('/:hotelId/rooms/:roomId', Cms.Hotels.deleteRoomId)

router.delete('/:id/:filename', Cms.Hotels.image)

export default router





