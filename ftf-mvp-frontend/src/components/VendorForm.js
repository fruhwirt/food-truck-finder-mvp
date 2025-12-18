// src/components/VendorForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { X, Save, Truck, Plus, Copy, CalendarDays, Trash2, CheckCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

const TRUCK_DIRECTORY = {
    "Double Dubs": { social: "https://facebook.com/WWDoubleDubs/", menu: "https://facebook.com/WWDoubleDubs/menu" },
    "Tia's Mexican Food": { social: "https://facebook.com/TiasMexicanFood/", menu: "" },
    "Crāv-A-Bowl": { social: "https://facebook.com/CravABowl", menu: "https://feedyourcrav.com/menu" },
    "Bangkok Bites": { social: "https://facebook.com/BangkokBitesCheyenne", menu: "https://bangkokbitescheyenne.com/order" }
};

const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function VendorForm({ onScheduleAdded, onClose }) {
    const [entries, setEntries] = useState([{
        title: '', date: new Date(), time: '11:00 AM - 2:00 PM', location: '', social_link: '', menu_link: '', saved: false
    }]);
    const [loading, setLoading] = useState(false);

    const updateEntry = (index, name, value) => {
        const newEntries = [...entries];
        newEntries[index][name] = value;
        newEntries[index].saved = false; // Mark as unsaved if changed

        if (name === 'title') {
            const match = Object.keys(TRUCK_DIRECTORY).find(k => k.toLowerCase() === value.toLowerCase());
            if (match) {
                newEntries[index].social_link = TRUCK_DIRECTORY[match].social;
                newEntries[index].menu_link = TRUCK_DIRECTORY[match].menu;
            }
        }
        setEntries(newEntries);
    };

    // SAVE SINGLE ROW
    const saveSingleRow = async (index) => {
        const entry = entries[index];
        const payload = { ...entry, date: formatDateForAPI(entry.date) };
        
        try {
            const res = await fetch(`${API_BASE_URL}/schedules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const newEntries = [...entries];
                newEntries[index].saved = true;
                setEntries(newEntries);
                onScheduleAdded();
            }
        } catch (err) { console.error(err); }
    };

    const duplicateEntry = (index, days) => {
        const entryToCopy = { ...entries[index], saved: false };
        const nextDate = new Date(entryToCopy.date);
        nextDate.setDate(nextDate.getDate() + days);
        setEntries([...entries, { ...entryToCopy, date: nextDate }]);
    };

    const removeEntry = (index) => setEntries(entries.filter((_, i) => i !== index));

    return (
        <div className="modal-backdrop">
            <div className="modal-content vendor-form-modal" style={{ maxWidth: '900px', width: '98%', padding: '0' }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}><Truck size={20} /> Bulk Schedule Builder</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {/* SCROLLABLE LIST AREA */}
                <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '20px', backgroundColor: '#fcfcfc' }}>
                    {entries.map((entry, index) => (
                        <div key={index} style={{ 
                            display: 'flex', gap: '10px', alignItems: 'flex-end', 
                            backgroundColor: 'white', padding: '15px', borderRadius: '8px', 
                            border: entry.saved ? '1px solid #4ade80' : '1px solid #ddd',
                            marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ flex: 2 }}>
                                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>Truck</label>
                                <input list="truck-list" value={entry.title} onChange={(e) => updateEntry(index, 'title', e.target.value)} placeholder="Name" />
                            </div>
                            
                            <div style={{ flex: 3 }}>
                                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>Address</label>
                                <input value={entry.location} onChange={(e) => updateEntry(index, 'location', e.target.value)} placeholder="123 Street St" />
                            </div>

                            <div style={{ width: '140px' }}>
                                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>Date</label>
                                <DatePicker selected={entry.date} onChange={(d) => updateEntry(index, 'date', d)} dateFormat="MMM d" className="compact-date" />
                            </div>

                            <div style={{ width: '150px' }}>
                                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888' }}>Time</label>
                                <input value={entry.time} onChange={(e) => updateEntry(index, 'time', e.target.value)} />
                            </div>

                            {/* Action Buttons (The Calendly Icons) */}
                            <div style={{ display: 'flex', gap: '5px', paddingBottom: '5px' }}>
                                <button type="button" onClick={() => saveSingleRow(index)} title="Save this row" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: entry.saved ? '#4ade80' : '#888' }}>
                                    {entry.saved ? <CheckCircle size={18} /> : <Save size={18} />}
                                </button>
                                <button type="button" onClick={() => duplicateEntry(index, 1)} title="Clone +1 Day" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}><Copy size={18} /></button>
                                <button type="button" onClick={() => duplicateEntry(index, 7)} title="Weekly Repeat" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}><CalendarDays size={18} /></button>
                                {entries.length > 1 && (
                                    <button type="button" onClick={() => removeEntry(index)} style={{ padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#ff4d4d' }}><Trash2 size={18} /></button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={() => setEntries([...entries, { title: '', date: new Date(), time: '11:00 AM - 2:00 PM', location: '', social_link: '', menu_link: '', saved: false }])} style={{ width: '100%', padding: '12px', border: '1px dashed #bbb', background: 'none', borderRadius: '8px', cursor: 'pointer', color: '#666' }}>
                        <Plus size={16} /> Add Another Entry
                    </button>
                </div>

                {/* Footer Footer */}
                <div style={{ padding: '20px', borderTop: '1px solid #eee', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                     <button className="button" style={{ background: '#eee', color: '#333' }} onClick={onClose}>Done</button>
                     <button className="button submit-button" disabled={loading} onClick={() => entries.forEach((_, i) => saveSingleRow(i))}>
                        Publish All to Map
                     </button>
                </div>

                <datalist id="truck-list">
                    {Object.keys(TRUCK_DIRECTORY).map(n => <option key={n} value={n} />)}
                </datalist>
            </div>
        </div>
    );
}

export default VendorForm;