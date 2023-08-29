import {Cms} from '../../controllers/index.js'
import express from 'express'
import { fileUpload } from '../../lib/index.js'

const router = express.Router()

const mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

router.route('/')
    .get(Cms.Categories.index)
    .post(fileUpload(mimes).array('files'), Cms.Categories.store)
router.route('/:id')
    .get(Cms.Categories.show)
    .put(fileUpload(mimes).array('files'), Cms.Categories.update)
    .patch(fileUpload(mimes).array('files'), Cms.Categories.update)
    .delete(Cms.Categories.destroy)

router.delete('/:id/:filename', Cms.Categories.image)

export default router