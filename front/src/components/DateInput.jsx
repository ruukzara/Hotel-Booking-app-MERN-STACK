import { useState } from 'react';
import moment from 'moment';
import React from 'react';
import { dtFormat } from '../lib';


export const DateInput = ({ onChange, value }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;

    const isDuplicate = value && value.includes(selectedDate);

    if (isDuplicate) {
      setError('Selected date already exists');
    } else {
      setDate(selectedDate);
      setError('');
    }
  };

  const handleAddDate = () => {
    if (date) {
      onChange(Array.isArray(value) ? [...value, date] : [date]);
      setDate('');
      setError('');
    }
  };

  const handleRemoveDate = (index) => {
    const updatedDates = Array.isArray(value) ? [...value] : [];
    updatedDates.splice(index, 1);
    onChange(updatedDates);
  };


  return (
    <div>
      <div>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          style={{ width: '345px' }}
          placeholder="Enter date (DD-MM-YYYY)"
          min={moment().format('YYYY-MM-DD')} // Set the minimum date to today
        />
        <button style={{ width: '49%' }} type="button" onClick={handleAddDate}>
          Add Date
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ maxHeight: '70px', overflowY: 'auto' }}>
        {Array.isArray(value) && value.map((date, index) => (
          <li key={index}>
            {dtFormat(date)}
            <button type="button" onClick={() => handleRemoveDate(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
