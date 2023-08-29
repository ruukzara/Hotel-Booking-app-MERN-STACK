import express from "express"
import { Cms } from "../../controllers/index.js"
import { adminOnly, fileUpload } from "../../lib/index.js"

const router = express.Router()

const mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

router.route('/:hotelId/:id').post(fileUpload(mimes).array('files'), Cms.Rooms.createRoom, adminOnly)

router.route('/:id').get(Cms.Rooms.getRoomById)
router.delete('/delete-dates/:roomId/:roomNumberIndex/:unavailDateIndex', Cms.Rooms.deleteRoomDates, adminOnly)
router.put("/availability/:roomNumberId", Cms.Rooms.updateRoomAvail)
router.route('/:hotelId/:id')
.delete(Cms.Rooms.deleteRoom, adminOnly)
router.route('/:hotelId/:id')
.put(fileUpload(mimes).array('files'), Cms.Rooms.updateRoom, adminOnly)
.patch(fileUpload(mimes).array('files'), Cms.Rooms.updateRoom, adminOnly)
router.route('/').get(Cms.Rooms.getAllRooms)


router.delete('/images/:roomId/:filename',Cms.Rooms.deleteImage);


export default router
