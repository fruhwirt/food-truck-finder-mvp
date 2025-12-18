// src/components/VendorForm.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { X, Save, Truck } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// 1. MASTER TRUCK DICTIONARY (Auto-fills your links)
const TRUCK_DIRECTORY = {
    "Double Dubs": {
        social: "https://www.facebook.com/WWDoubleDubs/",
        menu: "https://www.facebook.com/WWDoubleDubs/menu"
    },
    "Tia's Mexican Food": {
        social: "https://www.facebook.com/TiasMexicanFood/",
        menu: ""
    },
    "Queso's Mexican Food": {
        social: "https://www.facebook.com/quesosmexicanfood/",
        menu: ""
    },
    "Crāv-A-Bowl": {
        social: "https://www.facebook.com/CravABowl",
        menu: "https://www.feedyourcrav.com/menu"
    },
    "Bangkok Bites": {
        social: "https://www.facebook.com/BangkokBitesCheyenne",
        menu: "https://www.bangkokbitescheyenne.com/order"
    },
    "Nay & Jays": {
        social: "https://www.facebook.com/nayandjays",
        menu: ""
    },
    "The Florista": {
        social: "https://www.facebook.com/thefloristacheyenne",
        menu: ""
    }
};

const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function VendorForm({ onScheduleAdded, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        date: new Date(),
        time: '11:00 AM - 2:00 PM',
        location: '',
        social_link: '',
        menu_link: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 2. AUTO-POPULATE LOGIC
    useEffect(() => {
        const match = Object.keys(TRUCK_DIRECTORY).find(
            key => key.toLowerCase() === formData.title.toLowerCase()
        );

        if (match) {
            setFormData(prev => ({
                ...prev,
                // Only fill if current field is empty to avoid overwriting manual changes
                social_link: prev.social_link || TRUCK_DIRECTORY[match].social,
                menu_link: prev.menu_link || TRUCK_DIRECTORY[match].menu
            }));
        }
    }, [formData.title]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            date: formatDateForAPI(formData.date), 
            menu_link: formData.menu_link || null
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/schedules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to add schedule.');

            setSuccess(true);
            onScheduleAdded(data);
            setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content vendor-form-modal">
                <button className="modal-close-button" onClick={onClose} disabled={loading}>
                    <X size={24} />
                </button>
                
                <h2><Truck size={24} style={{ marginRight: '8px' }}/> Add Your Truck Schedule</h2>
                
                <form onSubmit={handleSubmit}>
                    <label>Truck Name</label>
                    <input
                        type="text"
                        name="title"
                        list="truck-list" // Link to the datalist below
                        value={formData.title}
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                    {/* 3. AUTOCOMPLETE LIST */}
                    <datalist id="truck-list">
                        {Object.keys(TRUCK_DIRECTORY).map(name => (
                            <option key={name} value={name} />
                        ))}
                    </datalist>

                    <label>Full Location Address</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., 500 Capitol Ave, Cheyenne, WY 82001"
                        required
                    />

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <DatePicker
                                selected={formData.date}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()}
                                className="date-picker-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Time Window</label>
                            <input
                                type="text"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <label>Social Media Link</label>
                    <input
                        type="url"
                        name="social_link"
                        value={formData.social_link}
                        onChange={handleChange}
                        placeholder="https://facebook.com/truckpage"
                        required
                    />

                    <label>Menu Link (Optional)</label>
                    <input
                        type="url"
                        name="menu_link"
                        value={formData.menu_link}
                        onChange={handleChange}
                    />

                    {loading && <p className="status-message">Saving & Geocoding...</p>}
                    {error && <p className="status-message error">{error}</p>}
                    {success && <p className="status-message success">Schedule added!</p>}

                    <button type="submit" className="button submit-button" disabled={loading || success}>
                        <Save size={18} style={{ marginRight: '8px' }}/> 
                        {loading ? 'Submitting...' : 'Save Schedule'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VendorForm;