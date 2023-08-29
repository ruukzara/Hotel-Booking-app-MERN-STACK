import { Cms } from '../../controllers/index.js'
import express from 'express'

const router = express.Router()

router.route('/')
    .get(Cms.Brands.getBrands)
    .post(Cms.Brands.createBrand)
router.route('/:id')
    .get(Cms.Brands.getBrandById)
    .put(Cms.Brands.updateBrand)
    .patch(Cms.Brands.updateBrand)
    .delete(Cms.Brands.deleteBrand)

export default router