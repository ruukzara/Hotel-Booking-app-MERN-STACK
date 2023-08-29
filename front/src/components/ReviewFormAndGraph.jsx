import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import http from '../http';
import "./ReviewFormAndGraph.css";
import ReactStars from 'react-rating-stars-component';
import { useParams } from 'react-router-dom';
import { inStorage, isNull } from '../lib';

export const ReviewFormAndGraph = () => {
    const [hotel, setHotel] = useState([]);
    const [rating, setRating] = useState(2);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState('');
    const [submittedReviews, setSubmittedReviews] = useState([]);

    const params = useParams();

    const user = useSelector(st => st.user.value);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const token = inStorage('user_token');
            const newReview = {
                rating: rating,
                comments: comments,
                user: user
            };
            const response = await http.post(`/hotel/${params.id}/review`, newReview, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('API Response:', response.data);

            if (response && response.data && response.data.success === 'Thankyou for your review.') {
                const newReviewData = {
                    rating: newReview.rating,
                    comments: newReview.comments,
                    hotelId: params.id,
                    user: newReview.user
                };
                setSubmittedReviews([...submittedReviews, newReviewData]);
            }

        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Logic for storing in local storage
    useEffect(() => {
        if (submittedReviews?.length) {
            localStorage.setItem('reviews', JSON.stringify(submittedReviews));
        }
    }, [submittedReviews]);

    useEffect(() => {
        const retrivedReviews = JSON.parse(localStorage.getItem('reviews'));
        if (retrivedReviews) {
            setSubmittedReviews(retrivedReviews);
        }
    }, []);

    const filteredReviews = submittedReviews.filter(review => review.hotelId === params.id);


    return (
        <div className="container">
            <div className="form-container">
                {!isNull(user) ? (
                    <>
                        <h2>Leave a Review</h2>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="rating">Ratings:</label>
                            <ReactStars
                                count={5}
                                value={rating}
                                onChange={newRating => setRating(newRating)}
                                size={40}
                                activeColor="#ffd700"
                            />
                            <br />
                            <label htmlFor="comments">Comments:</label>
                            <textarea
                                id="comments"
                                name="comments"
                                rows="4"
                                cols="50"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                            />
                            <br />
                            <button type="submit">Add Review</button>
                        </form>
                    </>
                ) : (
                    <h4><i>Please login to place your review</i></h4>
                )}

                <div className="review-list" style={{ marginTop: "20px", border: "1px solid lightgrey", padding: "5px" }}>
                    {filteredReviews.length === 0 ? (
                        <p>No reviews added yet.</p>
                    ) : (
                        <div>
                            {filteredReviews.map((review, index) => (
                                <div className="review-item" key={index} style={{ marginTop: "10px", border: "1px solid lightgrey", padding: "5px", backgroundColor: "white" }}>
                                    {review.user && <p><i className='fa-solid fa-user-circle'></i> {review.user.name}</p>}
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false} // Disable interactivity
                                        activeColor="#ffd700"
                                    />
                                    <p>Comment: {review.comments}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
