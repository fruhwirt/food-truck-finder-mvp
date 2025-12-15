// src/components/DateFilter.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Make sure you have this CSS imported in App.css or index.js

const DateFilter = ({ onDateChange, currentDate }) => {
    return (
        <div className="date-filter-container">
            <label htmlFor="date-picker" style={{ color: 'white', marginRight: '10px' }}>
                Viewing Date:
            </label>
            <DatePicker
                id="date-picker"
                selected={currentDate}
                onChange={onDateChange}
                dateFormat="MMMM d, yyyy"
                className="date-picker-input"
                popperPlacement="bottom-end"
            />
        </div>
    );
};

export default DateFilter;