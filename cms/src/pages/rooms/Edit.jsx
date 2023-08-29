import React, { useEffect, useState } from "react";
import "./index.css";
import { dtFormat, imgUrl, isNull, setInState } from "../../lib";
import { DateInput, Loading, SubmitButton } from "../../components";
import http from "../../http";
import { useNavigate, useParams } from "react-router-dom";

export const Edit = () => {
    const [rooms, setRooms] = useState({ roomPictures: [] });
    const [hotels, setHotels] = useState([]);
    const [loginForm, setLoginForm] = useState({ roomPictures: [], hotelId: '' });
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [dates, setDates] = useState([]);

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        setLoadingPage(true);
        http.get(`/cms/rooms/${params.id}`)
            .then(({ data }) => {
                setRooms(data);
                const roomNumberValues = data.roomNumbers.map(roomNumber => roomNumber.number).join(', ');

                setLoginForm((prevLoginForm) => ({
                    ...prevLoginForm,
                    hotelId: data.hotelId,
                    title: data.title,
                    desc: data.desc,
                    number: roomNumberValues, // Set the extracted room numbers
                    unavailDates: data.roomNumbers.flatMap(roomNumber => roomNumber.unavailDates),
                    roomPictures: data.roomPictures,
                    capacity: data.capacity,
                    price: data.price,
                    discounted_price: data.discounted_price,
                    amenities: data.amenities,
                }));
            })
            .catch(error => { })
            .finally(() => setLoadingPage(false));
    }, [params.id]);

    useEffect(() => {
        setLoading(true);

        http.get('/cms/hotels')
            .then(({ data }) => {
                setHotels(data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error("Error fetching hotel data:", error);
            });
    }, []);

    const handleInChange = (newDates, ev) => {
        setDates(newDates);
    };

    const handleChange = ev => setInState(ev, loginForm, setLoginForm);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
    
        if (files.length > 0) {
            const imageFiles = Array.from(files).map((file) => ({ fieldname: name, file }));
    
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                roomPictures: imageFiles, // Replace the existing files with the new ones
            }));
        }
    };
    
    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
    
        const hotelWithMatchingRoom = hotels.find(hotel =>
            hotel.room.some(roomInHotel => roomInHotel._id === rooms._id)
        );
    
        const hotelId = hotelWithMatchingRoom ? hotelWithMatchingRoom._id : '';
        
        const formData = new FormData()

        formData.append('hotelId', hotelId);
        formData.append('title', loginForm.title);
        formData.append('desc', loginForm.desc);
        formData.append('number', loginForm.number);
        formData.append('capacity', loginForm.capacity);
        formData.append('price', loginForm.price);
        formData.append('discounted_price', loginForm.discounted_price);
        formData.append('amenities', loginForm.amenities);

         // Append roomImages to formData
         loginForm.roomPictures.forEach((file, index) => {
            formData.append('files', file.file); // Append file and filename
        });
    
        // Convert the dates to ISO strings before sending
        const isoDates = dates.map(date => new Date(date).toISOString());
    
        for (const isoDate of isoDates) {
            formData.append('unavailDates', isoDate);
        }
    
        http.patch(`/cms/rooms/${hotelId}/${params.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }})
            .then(() => navigate('/cms/rooms'))
            .catch(err => { console.log(err) })
            .finally(() => setLoading(false));
    };
    

    const handleImgDel = (roomId, filename) => {
        setLoadingPage(true);
    
        http
            .delete(`/cms/rooms/images/${roomId}/${filename}`)
            .then(() => http.get(`cms/rooms/${rooms._id}`))
            .then(({ data }) => setHotels(data))
            .catch((err) => {})
            .finally(() => setLoadingPage(false));
    };
    
    
    

    return <div className="edit-room-login-form">
        <h2 className="edit-staff-label">Edit-Room</h2>
        {loadingPage ?
            <Loading /> :
            <form className="create-form" onSubmit={handleSubmit}>
                <div className="name-input">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" name="title" defaultValue={loginForm.title} onChange={handleChange} />
                </div>
                <div className="name-input">
                    <label htmlFor="desc">Description:</label>
                    <input type="text" id="desc" name="desc" defaultValue={loginForm.desc} onChange={handleChange} />
                </div>
                <div className="image-input" style={{marginLeft:"-50px"}}>
                    <label htmlFor="roomPictures">Room Images: </label>
                    <input
                        className="field-input"
                        type="file"
                        name="roomPictures"
                        id="roomPictures"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'roomPictures')}
                        multiple
                    />
                    {'files' in loginForm ? (
                        <div className="image-preview-container">
                            <div className="image-preview">
                                {loginForm.files.map((file, i) => (
                                    <div key={i} className="image-file-upload">
                                        <img
                                            src={URL.createObjectURL(file.file)}
                                            alt={`Image${i}`}
                                            style={{ height: "60px", width: "100px" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>) : null
                    }
                    <div className="image-preview-container">
                        <div className="image-preview">
                            {rooms.roomPictures.map((image, i) => (
                                <div key={i} className="image-file-upload">
                                    <img src={imgUrl(image)} alt={`Image${i}`} style={{ height: "60px", width: "100px" }} />
                                    <button className="fa-delete-button" onClick={() => handleImgDel(rooms._id, image)}>
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="name-input">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" name="price" value={loginForm.price} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="discounted_price">Discounted price</label>
                    <input type="number" id="discounted_price" name="discounted_price" value={loginForm.discounted_price} onChange={handleChange} required />
                </div>
                <div className="name-input" style={{ width: "345px", marginLeft: "10px" }}>
                    <label htmlFor="number">Room number:</label>
                    <input type="Number" id="number" name="number" defaultValue={loginForm.number}
                        onChange={handleChange} disabled />
                </div>
                <div className="name-input">
                    <div className="name-input">
                        <label htmlFor="unavailDates">Unavail Dates:</label>

                        <div>
                            <DateInput type="date" id="unavailDates" value={dates} name="unavailDates" onChange={handleInChange} style={{ width: "345px" }} disabled />
                        </div>
                    </div>
                </div>
                <div className="name-input">
                    <label htmlFor="capacity">Capacity</label>
                    <input type="number" id="capacity" name="capacity" defaultValue={loginForm.capacity} onChange={handleChange} />
                </div>
                <div className="name-input">
                    <label htmlFor="amenities">Amenities:</label>
                    <input type="text" id="amenities" name="amenities" defaultValue={loginForm.amenities} onChange={handleChange} />
                </div>
                <div className="submit-input">
                    <SubmitButton disabled={loading} />
                </div>
            </form >

        }</div>
}
