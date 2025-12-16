// src/components/VendorForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { X, Save, Truck } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Utility function to format date to YYYY-MM-DD string
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
        setSuccess(false);

        const payload = {
            ...formData,
            // Convert the date object to the required YYYY-MM-DD string
            date: formatDateForAPI(formData.date), 
            // Ensure menu_link is null if empty string
            menu_link: formData.menu_link || null
        };
        
        console.log('Sending payload to API:', payload);

        try {
            const response = await fetch(`${API_BASE_URL}/schedules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                // The API will return a 400 if geocoding fails, etc.
                const message = data.message || 'Failed to add schedule. Check your inputs.';
                throw new Error(message);
            }

            setSuccess(true);
            onScheduleAdded(data); // Pass the new schedule back to App.js
            setTimeout(onClose, 1500); // Close modal after success
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
                <p className="form-tip">
                    Enter the address precisely. The system will use Google Geocoding to find the coordinates.
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Truck Details */}
                    <label>Truck Name</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    {/* Location */}
                    <label>Full Location Address</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., 500 Capitol Ave, Cheyenne, WY 82001"
                        required
                    />

                    {/* Date and Time */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <DatePicker
                                selected={formData.date}
                                onChange={handleDateChange}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()} // Prevent scheduling in the past
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
                                placeholder="e.g., 11:00 AM - 2:00 PM"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Links */}
                    <label>Social Media Link</label>
                    <input
                        type="url"
                        name="social_link"
                        value={formData.social_link}
                        onChange={handleChange}
                        placeholder="https://instagram.com/mytruck"
                        required
                    />

                    <label>Menu Link (Optional)</label>
                    <input
                        type="url"
                        name="menu_link"
                        value={formData.menu_link}
                        onChange={handleChange}
                        placeholder="https://mytruck.com/menu"
                    />

                    {/* Status & Submit */}
                    {loading && <p className="status-message">Saving schedule and geocoding address...</p>}
                    {error && <p className="status-message error">{error}</p>}
                    {success && <p className="status-message success">Schedule added successfully!</p>}

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