// src/components/VendorForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { X, Save, Truck, Plus, Copy, CalendarDays, Trash2 } from 'lucide-react';

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
    // Now managing an ARRAY of entries
    const [entries, setEntries] = useState([{
        title: '',
        date: new Date(),
        time: '11:00 AM - 2:00 PM',
        location: '',
        social_link: '',
        menu_link: '',
    }]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Update specific field for a specific entry
    const updateEntry = (index, name, value) => {
        const newEntries = [...entries];
        newEntries[index][name] = value;

        // Auto-populate logic integrated directly here
        if (name === 'title') {
            const match = Object.keys(TRUCK_DIRECTORY).find(
                key => key.toLowerCase() === value.toLowerCase()
            );
            if (match) {
                newEntries[index].social_link = TRUCK_DIRECTORY[match].social;
                newEntries[index].menu_link = TRUCK_DIRECTORY[match].menu;
            }
        }
        setEntries(newEntries);
    };

    // CLONE: Copies entry to a new row and adds 1 day
    const duplicateEntry = (index) => {
        const entryToCopy = { ...entries[index] };
        const nextDate = new Date(entryToCopy.date);
        nextDate.setDate(nextDate.getDate() + 1);
        setEntries([...entries, { ...entryToCopy, date: nextDate }]);
    };

    // WEEKLY: Copies entry to a new row and adds 7 days
    const repeatWeekly = (index) => {
        const entryToCopy = { ...entries[index] };
        const nextWeekDate = new Date(entryToCopy.date);
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        setEntries([...entries, { ...entryToCopy, date: nextWeekDate }]);
    };

    const removeEntry = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let successCount = 0;

        // Loop through all entries and POST them one by one
        for (const entry of entries) {
            const payload = {
                ...entry,
                date: formatDateForAPI(entry.date),
                menu_link: entry.menu_link || null
            };

            try {
                const response = await fetch(`${API_BASE_URL}/schedules`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (response.ok) successCount++;
            } catch (err) {
                console.error("Submission error:", err);
            }
        }

        if (successCount > 0) {
            setSuccess(true);
            onScheduleAdded();
            setTimeout(onClose, 1500);
        } else {
            setError("Failed to add schedules. Please check your connection.");
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content vendor-form-modal" style={{ maxWidth: '700px', width: '95%', maxHeight: '90vh' }}>
                <button className="modal-close-button" onClick={onClose} disabled={loading}>
                    <X size={24} />
                </button>
                
                <h2><Truck size={24} style={{ marginRight: '8px' }}/> Schedule Builder</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '5px' }}>
                        {entries.map((entry, index) => (
                            <div key={index} className="entry-card" style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fdfdfd' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Day #{index + 1}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button type="button" onClick={() => duplicateEntry(index)} title="Clone to next day" style={{ padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Copy size={14} /> +1 Day
                                        </button>
                                        <button type="button" onClick={() => repeatWeekly(index)} title="Repeat next week" style={{ padding: '4px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <CalendarDays size={14} /> +7 Days
                                        </button>
                                        {entries.length > 1 && (
                                            <button type="button" onClick={() => removeEntry(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <label>Truck Name</label>
                                <input
                                    type="text"
                                    list="truck-list"
                                    value={entry.title}
                                    onChange={(e) => updateEntry(index, 'title', e.target.value)}
                                    autoComplete="off"
                                    required
                                />

                                <label>Full Location Address</label>
                                <input
                                    type="text"
                                    value={entry.location}
                                    onChange={(e) => updateEntry(index, 'location', e.target.value)}
                                    placeholder="e.g., 1509 Pioneer Ave, Cheyenne, WY 82001"
                                    required
                                />

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <DatePicker
                                            selected={entry.date}
                                            onChange={(date) => updateEntry(index, 'date', date)}
                                            dateFormat="MMMM d, yyyy"
                                            className="date-picker-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Time Window</label>
                                        <input
                                            type="text"
                                            value={entry.time}
                                            onChange={(e) => updateEntry(index, 'time', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row" style={{ marginTop: '10px' }}>
                                    <div className="form-group">
                                        <label>Social Link</label>
                                        <input type="url" value={entry.social_link} onChange={(e) => updateEntry(index, 'social_link', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Menu Link</label>
                                        <input type="url" value={entry.menu_link} onChange={(e) => updateEntry(index, 'menu_link', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={() => setEntries([...entries, { title: '', date: new Date(), time: '11:00 AM - 2:00 PM', location: '', social_link: '', menu_link: '' }])} style={{ width: '100%', padding: '10px', border: '2px dashed #ddd', background: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}>
                            <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Add Blank Day
                        </button>
                    </div>

                    <div style={{ paddingTop: '10px', borderTop: '1px solid #eee' }}>
                        {loading && <p className="status-message">Saving {entries.length} schedules...</p>}
                        {error && <p className="status-message error">{error}</p>}
                        {success && <p className="status-message success">All schedules added!</p>}

                        <button type="submit" className="button submit-button" disabled={loading || success}>
                            <Save size={18} style={{ marginRight: '8px' }}/> 
                            {loading ? 'Submitting...' : `Publish ${entries.length} Schedules`}
                        </button>
                    </div>
                </form>
            </div>
            
            <datalist id="truck-list">
                {Object.keys(TRUCK_DIRECTORY).map(name => (
                    <option key={name} value={name} />
                ))}
            </datalist>
        </div>
    );
}

export default VendorForm;