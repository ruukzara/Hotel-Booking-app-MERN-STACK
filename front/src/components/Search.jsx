import React, { useContext, useEffect, useState } from "react";
import { DatePicker } from 'antd'
import "./index.css";
import dayjs from 'dayjs';
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../useContext/SearchContext";

const { RangePicker } = DatePicker

export const Search = () => {
    const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dates, setDates] = useState([]);
    const navigate = useNavigate()

    const [destination, setDestination] = useState("");
    const [options, setOptions] = useState({
        adult: 1,
        children: 0,
        room: 1,
    });


    const disabledDate = date => {
        const today = dayjs();
        return date && date < today.startOf('day') && date !== today;
    }

    useEffect(() => {
    }, [dates]);


    const toggleGuestsDropdown = () => {
        setShowGuestsDropdown((prevState) => !prevState);
    };
    
    // Update search values when the user interacts with the UI
    const handleDateChange = (date, dateString) => {
        if (date) {
            let startDate = dateString[0];
            let endDate = dateString[1];
            setDates([startDate, endDate]);
        }
    };

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
                ...prev,
                [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
            };
        });
    };

    const { dispatch } = useContext(SearchContext);

    const handleSearch = () => {
        dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
        navigate("/search", { state: { destination, dates, options } });
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <div className="typing-field">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="search-input"
                        placeholder="Search for hotels..."
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <div className="calendar">
                    <div className="calendar-box">
                        <label htmlFor="checkInDate" className="check-in-label">Check-in/Check-out:</label>
                        <div className="date-picker-input">
                            <i className="fas fa-calendar date-picker-icon"></i>
                            <RangePicker
                                onChange={(handleDateChange)}
                                disabledDate={disabledDate}
                            />
                        </div>
                    </div>
                </div>
                <div className="guests">
                    <label onClick={toggleGuestsDropdown} className="guests-label">
                        <span className="guests-1">Guests & Rooms</span> <br /> {options.adult} Adults {options.room} Rooms
                    </label>
                    {showGuestsDropdown && (
                        <div className="guests-dropdown">
                            <div className="guests-dropdown-item">
                                <span>Adults:</span>
                                <button onClick={() => handleOption("adult", "d")}
                                >-</button>
                                <span>{options.adult}</span>
                                <button onClick={() => handleOption("adult", "i")}>+</button>
                            </div>
                            <div className="guests-dropdown-item">
                                <span>Children:</span>
                                <button onClick={() => handleOption("children", "d")}>-</button>
                                <span>{options.children}</span>
                                <button onClick={() => handleOption("children", "i")}>+</button>
                            </div>
                            <div className="guests-dropdown-item">
                                <span>Rooms:</span>
                                <button onClick={() => handleOption("room", "d")}>-</button>
                                <span>{options.room}</span>
                                <button onClick={() => handleOption("room", "i")}>+</button>
                            </div>
                        </div>
                    )}
                </div>
                {searchText.trim() ? (
                    <Link
                        to={{
                            pathname: `/search/city/${searchText}`,
                            search: `?startDate=${dates[0]}&endDate=${dates[1]}&adult=${options.adult}&children=${options.children}&room=${options.room}`
                        }}
                    >
                        <button className="search-btn" onClick={handleSearch}>Search</button>
                    </Link>
                ) : (
                    <Link to="/search">
                        <button className="search-btn" onClick={handleSearch}>Search</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

