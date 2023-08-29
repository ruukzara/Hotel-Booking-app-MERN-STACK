import mongoose from "mongoose"
import { anyError } from "../../lib/index.js"
import Hotel from "../../models/hotel.model.js"
import { unlink } from 'node:fs/promises'
import { promises as fsPromises } from 'fs';

class hotelController {

    newHotel = async (req, res, next) => {
        try {
            const { name, slug, description, address, distance, city, country, amenities, /* roomId, */ price, Discounted_Price, featured, brandId, categoryId, status, breakfastIncluded, pool, freeCancellation, noPrepayment, airportPickup } = req.body;

            const hotelImages = req.files.hotelImages.map(file => file.filename);
            const roomImages = req.files.roomImages.map(file => file.filename);


            // Create a new instance of the Hotel model
            const hotel = await Hotel.create({
                name,
                slug,
                description,
                address,
                distance,
                city,
                country,
                amenities,
                /* roomId: roomId ? new mongoose.Types.ObjectId(roomId) : null, */
                price,
                Discounted_Price,
                featured,
                brandId: brandId === 'null' ? null : brandId ? new mongoose.Types.ObjectId(brandId) : null,
                categoryId: categoryId ? new mongoose.Types.ObjectId(categoryId) : null,
                status,
                breakfastIncluded,
                pool,
                freeCancellation,
                noPrepayment,
                airportPickup,
                hotelImages: hotelImages,
                roomImages: roomImages,
            });

            res.json({
                success: 'New Hotel added.',
                hotel: hotel 
            });
        } catch (error) {
            next(error);
        }
    };

    getAllHotels = async (req, res, next) => {
        try {
            const hotels = await Hotel.aggregate([
                { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
                { $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' } },
                { $lookup: { from: 'rooms', localField: 'roomId', foreignField: '_id', as: 'room' } }
            ]).exec()

            const formattedHotels = hotels.map(hotel => {
                const rooms = hotel.room.map(room => {
                    return {
                        _id: room._id,
                        title: room.title,
                        desc: room.desc,
                        capacity: room.capacity,
                        price: room.price,
                        discounted_price: room.discounted_price,
                        roomPictures: room.roomPictures
                    };
                });

                return {
                    _id: hotel._id,
                    name: hotel.name,
                    slug: hotel.slug,
                    description: hotel.description,
                    address: hotel.address,
                    distance: hotel.distance,
                    city: hotel.city,
                    country: hotel.country,
                    amenities: hotel.amenities,
                    hotelImages: hotel.hotelImages,
                    roomImages: hotel.roomImages,
                    price: hotel.price,
                    Discounted_Price: hotel.Discounted_Price,
                    categoryId: hotel.categoryId,
                    brandId: hotel.brandId,
                    featured: hotel.featured,
                    status: hotel.status,
                    category: hotel.category,
                    brand: hotel.brand,
                    room: rooms,
                    breakfastIncluded: hotel.breakfastIncluded,
                    pool: hotel.pool,
                    freeCancellation: hotel.freeCancellation,
                    noPrepayment: hotel.noPrepayment,
                    airportPickup: hotel.airportPickup,
                    createdAt: hotel.createdAt,
                    updatedAt: hotel.updatedAt,
                    _v: hotel._v
                };
            });

            res.json(formattedHotels);
        } catch (err) {
            anyError(err, next)
        }
    }

    updateHotel = async (req, res, next) => {
        try {
            const { id } = req.params;

            // Get the hotel from the database
            const hotel = await Hotel.findById(id);

            // Check if the hotel exists
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }

            // Update the hotel properties from the request body
            const { name, slug, description, address, distance, city, country, amenities, roomId, price, Discounted_Price, featured, brandId, categoryId, status, breakfastIncluded, pool, freeCancellation, noPrepayment, airportPickup } = req.body;

            hotel.name = name;
            hotel.slug = slug;
            hotel.description = description;
            hotel.address = address;
            hotel.distance = distance;
            hotel.city = city;
            hotel.country = country;
            hotel.amenities = amenities;
            /* hotel.roomId = roomId ? new mongoose.Types.ObjectId(roomId) : null; */
            hotel.price = price;
            hotel.Discounted_Price = Discounted_Price;
            hotel.featured = featured;
            hotel.brandId = brandId === 'null' ? null : brandId ? new mongoose.Types.ObjectId(brandId) : null; 
            hotel.categoryId = categoryId ? new mongoose.Types.ObjectId(categoryId) : null;
            hotel.status = status;
            hotel.breakfastIncluded = breakfastIncluded;
            hotel.pool = pool;
            hotel.freeCancellation = freeCancellation;
            hotel.noPrepayment = noPrepayment;
            hotel.airportPickup = airportPickup;

            // Handle hotelImages
            if (req.files && req.files['hotelImages']) {
                const hotelImageFiles = req.files['hotelImages'].map(file => file.filename);
                hotel.hotelImages = [...hotel.hotelImages, ...hotelImageFiles];
            }

            if (req.files && req.files['roomImages']) {
                const roomImageFiles = req.files['roomImages'].map(file => file.filename);
                hotel.roomImages = [...hotel.roomImages, ...roomImageFiles];
            }

            // Save the updated hotel
            const updatedHotel = await hotel.save();

            res.json({ success: 'Hotel has been updated.', updatedHotel });
        } catch (error) {
            next(error);
        }
    };



    deleteHotel = async (req, res, next) => {
        try {
            const hotel = await Hotel.findById(req.params.id);

            // Check if the hotel record exists
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found.' });
            }

            if (Array.isArray(hotel.hotelImages)) {
                for (const image of hotel.hotelImages) {
                    try {
                        await unlink(`uploads/${image}`);
                    } catch (err) {
                        console.error('Error deleting hotel image:', err);
                        // You can choose to handle the error here, e.g., log it or ignore it.
                        // If some images don't exist, it's not a critical error and can be ignored.
                    }
                }
            }

            // Remove the room image files
            if (Array.isArray(hotel.roomImages)) {
                for (const image of hotel.roomImages) {
                    try {
                        await unlink(`uploads/${image}`);
                    } catch (err) {
                        console.error('Error deleting room image:', err);
                        // Handle the error as needed.
                    }
                }
            }

            // Delete the hotel record from the database
            await Hotel.findByIdAndDelete(req.params.id);

            res.status(200).json({ success: 'Hotel has been deleted.' });
        } catch (err) {
            console.error('Error deleting hotel:', err)
            next(err);
        }
    };


    getHotel = async (req, res, next) => {
        const hotelId = req.params.id;

        // Convert the hotelId to a Mongoose ObjectId
        const ObjectId = mongoose.Types.ObjectId;
        const objectIdHotelId = new ObjectId(hotelId);

        if (!mongoose.Types.ObjectId.isValid(hotelId)) {
            return res.status(400).json({ message: 'Invalid hotel ID' });
          }
          
        try {
            const hotel = await Hotel.findById(objectIdHotelId)

            res.status(200).json(hotel)
        } catch (err) {
            anyError(err, next)
        }
    }


    image = async (req, res, next) => {
        try {
            const hotel = await Hotel.findById(req.params.id);
    
            const imagePath = `uploads/${req.params.filename}`;
    
            try {
                await fsPromises.unlink(imagePath);
                console.log(`File ${imagePath} deleted successfully.`);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log(`File ${imagePath} not found. Skipping deletion.`);
                    
                } else {
                    console.error(`Error deleting file ${imagePath}:`, err);
                }
            }
    
            if (hotel.hotelImages.includes(req.params.filename)) {
                const hotelImages = hotel.hotelImages.filter(image => image !== req.params.filename);
                await Hotel.findByIdAndUpdate(req.params.id, { hotelImages });
                res.json({
                    message: 'Hotel image removed.'
                });
            } else if (hotel.roomImages.includes(req.params.filename)) {
                const roomImages = hotel.roomImages.filter(image => image !== req.params.filename);
                await Hotel.findByIdAndUpdate(req.params.id, { roomImages });
                res.json({
                    success: 'Room image removed.'
                });
            } else {
                next({
                    error: 'Image not found in hotel or room images.'
                });
            }
        } catch (err) {
            anyError(err, next);
        }
    };

    deleteRoomId = async (req, res) => {
        try {
            const { hotelId, roomId } = req.params;

            // Find the hotel by ID
            const hotel = await Hotel.findById(hotelId);

            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found' });
            }

            // Remove the roomId from the hotel's roomId array
            hotel.roomId.pull(roomId);

            // Save the updated hotel document
            await hotel.save();

            res.json({ success: 'Room deleted from hotel' });
        } catch (error) {
            console.error('Error deleting room from hotel:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}


export default new hotelController