import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "./index.css"

export const MinMaxSlider = ({ minValue, maxValue, min, max, onChange }) => {
  const [minValueState, setMinValue] = useState(minValue);
  const [maxValueState, setMaxValue] = useState(maxValue);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSliderChange = (values) => {
    setMinValue(values[0]);
    setMaxValue(values[1]);
    onChange(values[0], values[1]);
    setIsConfirmed(false); // Reset the confirmation status when slider value changes
  };

  const handleMinInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= maxValueState) {
      setMinValue(value);
      handleSliderChange([value, maxValueState]);
    }
  };

  const handleMaxInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value <= max && value >= minValueState) {
      setMaxValue(value);
      handleSliderChange([minValueState, value]);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setDropdownOpen(false); // Close the dropdown after confirming
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {isConfirmed ? (
          <span style={{ marginLeft: "10px" }}>
            {`Rs. ${minValueState} - Rs. ${maxValueState}`}
          </span>
        ) : (
          "Set Price"
        )}
        &nbsp;&nbsp;
        <i className={`fa-solid ${isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`} />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-content">
          <div className='slider-container-price'>
            <div className="manual-inputs">
              <div style={{ marginBottom: "30px" }}>
                <span><small>Min Value:&nbsp; &nbsp;Rs.</small></span>
                <input
                  type="number"
                  value={minValueState}
                  min={min}
                  max={maxValueState}
                  onChange={handleMinInputChange}
                  style={{ width: "70px" }}
                /> <br />
              </div>
              <div style={{ marginBottom: "30px" }}>
                <span><small>Max Value: &nbsp;Rs.</small></span>
                <input
                  type="number"
                  value={maxValueState}
                  min={minValueState}
                  max={max}
                  onChange={handleMaxInputChange}
                  style={{ width: "70px" }}
                />
              </div>
            </div>
            <Slider
              value={[minValueState, maxValueState]}
              min={min}
              max={max}
              onChange={handleSliderChange}
              range
            />
          <button onClick={handleConfirm}>Confirm</button> {/* Add the Confirm button */}
          </div>

        </div>
      )}
    </div>
  );
};
