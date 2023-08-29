import { useEffect, useState } from "react"
import "./index.css"
import { setInState } from "../../lib"
import { DateInput, SubmitButton } from "../../components"
import http from "../../http"
import { useNavigate, useParams } from "react-router-dom"
import React from 'react';


export const Create = () => {
    const [loginForm, setLoginForm] = useState({ roomPictures: [] })
    const [loading, setLoading] = useState(false)
    const [dates, setDates] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const params = useParams()

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files.length > 0) {
            const imageFiles = Array.from(files).map((file) => ({ fieldname: name, file }));

            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                roomPictures: imageFiles, // Set roomPictures to the selected image files
            }));
        }
    };


    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        const formData = new FormData();

        formData.append('hotelId', loginForm.hotelId);
        formData.append('title', loginForm.title);
        formData.append('desc', loginForm.desc);
        formData.append('number', loginForm.number);
        formData.append('capacity', loginForm.capacity);
        formData.append('price', loginForm.price);
        formData.append('discounted_price', loginForm.discounted_price);
        formData.append('amenities', loginForm.amenities);

        if (loginForm.roomPictures) {
            loginForm.roomPictures.forEach((file, index) => {
                formData.append('files', file.file); // Append file and filename
            });


            // Convert the dates to ISO strings before sending
            const isoDates = dates.map(date => new Date(date).toISOString());
            isoDates.forEach(isoDate => {
                formData.append('unavailDates', isoDate);
            });

            try {
                const response = await http.post(`/cms/rooms/${loginForm.hotelId}/${params.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(params.id)
                navigate('/cms/rooms');
            } catch (error) {
                // Handle errors here
                setError('An error occurred while updating the room');
            } finally {
                setLoading(false);
            }
        };
    }



    const handleInChange = (newDates) => {
        setDates(newDates)
    }

    useEffect(() => {
        setLoading(true)

        http.get('/cms/hotels')
            .then(({ data }) => {
                setHotels(data);
                if (data.length > 0) {
                    setLoginForm((prevLoginForm) => ({
                        ...prevLoginForm,
                        hotelId: data[0]._id
                    }));
                }
            })
            .catch(error => { })
            .finally(() => setLoading(false))

        if (hotels.length) {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                hotelId: hotels[0]._id
            }));
        }
    }, [])

    const optionsHotel = hotels.map((hotel) => ({
        label: hotel.name,
        value: hotel._id,
    }));

    return <div className="create-login-form">
        <h2 className="create-label">Add room</h2>
        <form className="create-form" onSubmit={handleSubmit}>
            <div className="name-input">
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={loginForm.title} onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="price">Description:</label>
                <input type="text" id="desc" name="desc" value={loginForm.desc} onChange={handleChange} required />
            </div>
            <div className="image-input">
                <label htmlFor="roomPictures">Room Images: </label>
                <input className="field-input" type="file" name="roomPictures" id="roomPictures" accept="images/*" onChange={handleFileChange} multiple required />
                {'files' in loginForm && loginForm.files.map((file, i) => file.fieldname === 'roomPictures' && (
                    <div key={i} className="image-file-upload">
                        <img src={URL.createObjectURL(file.file)} alt={`Image ${i}`} style={{ height: "60px", width: "100px" }} />
                    </div>
                ))}
            </div>
            <div className="name-input" style={{ width: "345px", marginLeft: "-5px" }}>
                <label htmlFor="number">Room Number:</label>
                <input type="number" id="number" name="number" value={loginForm.number}
                    onChange={handleChange} />
            </div>
            <div className="name-input">
                <label htmlFor="unavailDates">Unavail Dates:</label>
                <div >
                    <DateInput  type="date" id="unavailDates" value={dates} name="unavailDates" onChange={handleInChange} style={{ width: "345px" }} />
                </div>
            </div>
            <div className="room-input category-input">
                <label className="hotelId" htmlFor="hotelId"> Hotel: </label>
                <select id="hotelId" className="room-select hotelId-Room" name="hotelId" value={loginForm.hotelId} onChange={handleChange} >
                    {optionsHotel.map((hotel) => (
                        <option key={hotel.value} value={hotel.value}>{hotel.label}</option>
                    ))}
                </select>
            </div>
            <div className="name-input">
                <label htmlFor="capacity">Capacity</label>
                <input type="number" id="capacity" name="capacity" value={loginForm.capacity} onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" value={loginForm.price} onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="discounted_price">Discounted price</label>
                <input type="number" id="discounted_price" name="discounted_price" value={loginForm.discounted_price} onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="amenities">Amenities:</label>
                <input type="text" id="amenities" name="amenities" value={loginForm.amenities} onChange={handleChange} required />
            </div>
            <div className="submit-input">
                <SubmitButton disabled={loading} />
            </div>
        </form >
    </div >
} 
