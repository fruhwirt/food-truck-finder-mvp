// src/components/DateFilter.js
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateFilter = ({ onDateChange, currentDate }) => {
    
    const adjustDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        onDateChange(newDate);
    };

    return (
        <div className="date-filter-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* BACK ONE DAY */}
            <button 
                onClick={() => adjustDate(-1)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '4px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <ChevronLeft size={20} />
            </button>

            <div style={{ position: 'relative' }}>
                <DatePicker
                    id="date-picker"
                    selected={currentDate}
                    onChange={onDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="date-picker-input"
                    popperPlacement="bottom-end"
                />
            </div>

            {/* FORWARD ONE DAY */}
            <button 
                onClick={() => adjustDate(1)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '4px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default DateFilter;