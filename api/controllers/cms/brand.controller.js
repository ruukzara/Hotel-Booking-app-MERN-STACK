import  { anyError }  from '../../lib/index.js'
import { Brand } from '../../models/index.js'

class BrandsController {
  // Create a new brand
  createBrand = async (req, res, next) => {
    try {
      const { name, slug, status } = req.body

      await Brand.create({ name, slug, status })

      res.status(201).json({
        success: 'Brand created successfully.',
      })
    } catch (error) {
      anyError(error, next)
    }
  }

  // Get all brands
  getBrands = async (req, res, next) => {
    try {
      const brands = await Brand.find()

      res.json(brands)
    } catch (error) {
      anyError(error, next)
    }
  }

  // Get a single brand by ID
  getBrandById = async (req, res, next) => {
    try {
      const brandId = req.params.id

      const brand = await Brand.findById(brandId)

      if (!brand) {
        res.status(404).json({ error: 'Brand not found.' })
        return
      }

      res.json(brand)
    } catch (error) {
      anyError(error, next)
    }
  }

  // Update a brand
  updateBrand = async (req, res, next) => {
    try {
      const brandId = req.params.id
      const { name, slug, status } = req.body

      const brand = await Brand.findByIdAndUpdate(
        brandId,
        { name, slug, status },
        { new: true }
      )

      if (!brand) {
        res.status(404).json({ error: 'Brand not found.' })
        return
      }

      res.json({
        success: 'Brand updated successfully.',
      })
    } catch (error) {
      anyError(error, next)
    }
  }

  // Delete a brand
  deleteBrand = async (req, res, next) => {
    try {
      const brandId = req.params.id

      const brand = await Brand.findByIdAndDelete(brandId)

      if (!brand) {
        res.status(404).json({ error: 'Brand not found.' })
        return
      }

      res.json({ success: 'Brand deleted successfully.' })
    } catch (error) {
      anyError(error, next)
    }
  }
}

export default new BrandsController
