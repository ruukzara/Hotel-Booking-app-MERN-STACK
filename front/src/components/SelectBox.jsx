import React, { useState } from 'react';
import Select from 'react-select';

export const SelectBox = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options);

  const DropdownIndicator = () => {
    return null;
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption.value); 
  };
  
  
  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: '8px',
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '18px !important',
      marginRight: '-100px',
      transform: 'translate(45px, 3px) !important',
      color: 'black',
      // Increase the font size of the selected value
    }),
    control: (provided) => ({
      ...provided,
      height: '40px',
      minHeight: '39px',
      transform: 'translateY(9px) !important',
      // Adjust the height and position of the control
    }),
    placeholder: (provided, state) => ({
      ...provided,
      margin: '-10px -60px 10px',
      transform: 'translate(45px, 3px) !important',
      color: 'black',
      fontSize: '18px !important',
    }),
  };

  return (
    <div className="select-box">
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        options={options}
        styles={customStyles}
        components={{ DropdownIndicator }}
      />
    </div>
  );
};











/* import React, { useState } from 'react';
import './SelectBox.css'; 

export const SelectBox = ({ options, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
  
    const handleSelectChange = (event) => {
      const value = event.target.value;
      setSelectedOption(value);
      onChange(value);
    };
  
    return (
      <div className="select-box">
        <select value={selectedOption} onChange={handleSelectChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  };
   */

