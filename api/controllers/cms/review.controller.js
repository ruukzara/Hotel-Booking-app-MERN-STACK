import { anyError } from '../../lib/index.js'
import { Review } from '../../models/index.js'

class reviewController {
    // Add a new review
        addReview = async (req, res, next) => {
            try {
                let reviews = await Review.aggregate([
                    {$lookup: {from: 'hotels', localField: 'hotelId', foreignField: '_id', as: 'hotel'}},
                    {$lookup: {from: 'users', localField: 'userId', foreignField: '_id', as: 'user'}}
                ]).exec()
    
                reviews = reviews.map(review => {
                    return {
                        _id: review._id,
                        userId: review.userId,
                        hotelId: review.hotelId,
                        rating: review.rating,
                        comments: review.comments,
                        user: review.user[0],
                        createdAt: review.createdAt,
                        updatedAt: review.updatedAt,
                        __v: review.__v
                    }
                })
    
                res.json(reviews)
            } catch (err) {
                anyError(err, next)
            }
        }
    
        
        destroy = async (req, res, next) => {
            try {
                await Review.findByIdAndDelete(req.params.id)
    
                res.json({
                    success: 'Review removed.'
                })
            } catch {
                showError(err, next)
            }
        }
    }

export default new reviewController;
