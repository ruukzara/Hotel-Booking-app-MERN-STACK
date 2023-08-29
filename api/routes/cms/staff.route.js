import {Cms} from '../../controllers/index.js'
import express from 'express'

const router = express.Router()

router.route('/')
    .get(Cms.Staffs.index)
    .post(Cms.Staffs.store)
router.route('/:id')
    .get(Cms.Staffs.show)
    .put(Cms.Staffs.update)
    .patch(Cms.Staffs.update)
    .delete(Cms.Staffs.destroy)

export default router