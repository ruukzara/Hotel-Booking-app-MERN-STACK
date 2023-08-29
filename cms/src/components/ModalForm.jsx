import React, { useState } from 'react';
import './ModalForm.css';

export const ModalForm = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    breakfastIncluded: false,
    pool: false,
    freeCancellation: false,
    noPrepayment: false,
    airportPickup: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can perform any validation or submit the form data to the server
    console.log('Form data:', formData);
    onHide();
  };

  return (
    <>
      {show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Modal Form</div>
              <div className="modal-close-btn" onClick={onHide}>
                &times;
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="breakfastIncluded">
                    Breakfast Included
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    id="breakfastIncluded"
                    name="breakfastIncluded"
                    checked={formData.breakfastIncluded}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pool">
                    pool
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    id="pool"
                    name="pool"
                    checked={formData.pool}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="freeCancellation">
                    Free Cancellation
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    id="freeCancellation"
                    name="freeCancellation"
                    checked={formData.freeCancellation}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="noPrepayment">
                    No Prepayment
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    id="noPrepayment"
                    name="noPrepayment"
                    checked={formData.noPrepayment}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="airportPickup">
                    Airport Pickup
                  </label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    id="airportPickup"
                    name="airportPickup"
                    checked={formData.airportPickup}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

 

/*<div>
    <button onClick={handleOpenModal}>Open Modal</button>
    {showModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={handleCloseModal}>
                    &times;
                </span>
                <ModalForm show={showModal} onHide={handleCloseModal} />
            </div>
        </div>
    )}
</div> */