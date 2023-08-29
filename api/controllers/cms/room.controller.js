import { anyError } from '../../lib/index.js'
import { Hotel, Room } from '../../models/index.js'
import { unlink } from 'node:fs/promises'


class roomController {

    createRoom = async (req, res, next) => {
        try {
            const { title, desc, price, discounted_price, unavailDates, number, capacity, amenities } = req.body;
            const hotelId = req.params.hotelId;

            const roomPictures = req.files.map(file => file.filename);

            const existingRoom = await Room.findOne({ title });

            if (existingRoom) {
                // Find the index of the hyphen
                const hyphenIndex = title.indexOf('-')

                // Extract the room title using the index
                const roomTitle = hyphenIndex !== -1 ? title.slice(hyphenIndex + 2) : title;

                // Create the new title by appending a unique index number
                const index = await Room.countDocuments({ title: { $regex: `^${roomTitle}` } });
                const newTitle = `${roomTitle} - ${index + 1}`;

                // Create the new room with the new title
                const roomNumberObject = { number, unavailDates }
                const newRoom = new Room({ title: newTitle, desc, price, discounted_price, roomNumbers: [roomNumberObject], capacity, amenities, roomPictures });

                // Save the new room to the database
                await newRoom.save();

                // Push the new room ID to the hotel's rooms array
                await Hotel.findByIdAndUpdate(
                    { _id: hotelId },
                    { $push: { roomId: newRoom._id } }
                );

                res.status(201).json({
                    success: 'Room added to the hotel.',
                    room: newRoom,
                    hotelId: hotelId
                });
            } else {
                const roomNumberObject = { number, unavailDates };
                const newRoom = await Room.create({ title, desc, price, discounted_price, roomNumbers: [roomNumberObject], capacity, amenities, roomPictures });

                await newRoom.save();

                // Push the new room ID to the hotel's rooms array
                await Hotel.findByIdAndUpdate(
                    { _id: hotelId },
                    { $push: { roomId: newRoom._id } }
                );

                res.status(201).json({
                    success: 'Room added to the hotel.'
                });
            }
        } catch (error) {
            anyError(error, next);
        }
    };


    // Get all rooms
    getAllRooms = async (req, res, next) => {
        try {
            const rooms = await Room.find()

            res.status(200).json(rooms)
        } catch (error) {
            anyError(error, next)
        }
    }

    // Get a single room by ID
    getRoomById = async (req, res, next) => {
        try {
            const room = await Room.findById(req.params.id);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' })
            }

            res.status(200).json(room)
        } catch (error) {
            anyError(error, next)
        }
    }

    updateRoom = async (req, res, next) => {
        const { title, desc, price, discounted_price, number, unavailDates, capacity, amenities } = req.body;
        const roomId = req.params.id;

        try {
            const room = await Room.findById(roomId);

            if (!room) {
                res.status(404).json({
                    success: false,
                    message: 'Room not found',
                });
                return;
            }

            room.title = title;
            room.desc = desc;
            room.price = price;
            room.discounted_price = discounted_price;

            try {
                if (req.files && req.files.length > 0) {
                    const roomPicturesFiles = req.files.map(file => file.filename);
                    room.roomPictures = [...room.roomPictures, ...roomPicturesFiles];
                }
            } catch (error) {
                console.error('Error uploading room pictures:', error);
            }

            const roomNumbers = room.roomNumbers;
            const roomNumberIndex = 0; // Assuming you are working with the first roomNumber

            if (roomNumbers.length > roomNumberIndex) {
                const unavailDatesArr = roomNumbers[roomNumberIndex].unavailDates;

                if (Array.isArray(unavailDates) && unavailDates.length > 0) {
                    // Filter out undefined and empty string values from the unavailDates array
                    const validUnavailDates = unavailDates.filter(date => date);

                    // Convert the validUnavailDates to Date objects
                    const dateObjects = validUnavailDates.map(date => new Date(date));

                    // Concatenate the dateObjects array with the existing unavailDatesArr
                    roomNumbers[roomNumberIndex].unavailDates = [...unavailDatesArr, ...dateObjects];
                }
            }

            room.capacity = capacity;
            room.amenities = amenities;

            await room.save();

            res.status(200).json({
                success: 'Room updated successfully',
            });
        } catch (error) {
            anyError(error, next);
        }
    };

    updateRoomAvail = async (req, res, next) => {
        const roomNumberId = req.params.roomNumberId; // This should be the _id of the room number
        const { dates } = req.body;

        try {
            const updatedRoom = await Room.findOneAndUpdate(
                { "roomNumbers._id": roomNumberId },
                { $push: { "roomNumbers.$.unavailDates": dates } },
                { new: true } // This ensures that the updated room is returned
            );

            if (updatedRoom) {
                res.status(200).json("Room number availability has been updated.");
            } else {
                res.status(404).json("Room number not found.");
            }
        } catch (err) {
            anyError(err, next);
        }
    };

    deleteRoom = async (req, res, next) => {
        const roomId = req.params.id;

        try {
            // Delete the room from the Room collection
            const room = await Room.findByIdAndDelete(roomId)

            if (Array.isArray(room.roomPictures)) {
                for (const image of room.roomPictures) {
                    try {
                        await unlink(`uploads/${image}`);
                    } catch (err) {
                        console.error('Error deleting room image:', err);
                        // Handle the error as needed.
                    }
                }
            }

            res.status(200).json({
                success: 'Room deleted successfully.'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'An error occurred while deleting the room.'
            });
        }
    };

    deleteImage = async (req, res) => {
        const { roomId, filename } = req.params;

        try {
            const room = await Room.findByIdAndUpdate(
                roomId,
                { $pull: { roomPictures: filename } },
                { new: true }
            );

            res.json({
                message: 'Image deleted successfully.',
                room,
            });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting image.' });
        }
    };

    deleteRoomDates = async (req, res, next) => {
        try {
            const { roomId, roomNumberIndex, unavailDateIndex } = req.params;

            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            const roomNumber = room.roomNumbers[roomNumberIndex];

            if (!roomNumber) {
                return res.status(404).json({ message: 'Room number not found' });
            }

            // Remove the unavailDate from the specified roomNumber
            roomNumber.unavailDates.splice(unavailDateIndex, 1);

            await room.save();

            res.json({ message: 'UnavailDate deleted successfully' });
        } catch (error) {
            console.error('Error deleting unavailDate:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default new roomController;
