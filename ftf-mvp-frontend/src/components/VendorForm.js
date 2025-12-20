// src/components/VendorForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { X, Save, Truck, Plus, Copy, CalendarDays, Trash2, CheckCircle, Facebook, Instagram, Globe } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

// 1. UPDATED MASTER TRUCK DICTIONARY WITH INSTAGRAM
const TRUCK_DIRECTORY = {
    "Double Dubs": { 
        social: "https://www.facebook.com/WWDoubleDubs/", 
        instagram: "https://www.instagram.com/double_dubs_307/", 
        menu: "https://www.facebook.com/WWDoubleDubs/menu" 
    },
    "Tia's Mexican Food": { social: "https://www.facebook.com/TiasMexicanFood/", instagram: "", menu: "" },
    "Queso's Mexican Food": { social: "https://www.facebook.com/quesosmexicanfood/", instagram: "", menu: "" },
    "Crāv-A-Bowl": { 
        social: "https://www.facebook.com/CravABowl", 
        instagram: "https://www.instagram.com/cravabowl/", 
        menu: "https://www.feedyourcrav.com/menu" 
    },
    "Bangkok Bites": { social: "https://www.facebook.com/BangkokBitesCheyenne", instagram: "", menu: "https://www.bangkokbitescheyenne.com/order" },
    "Nay & Jays": { social: "https://www.facebook.com/nayandjays", instagram: "https://www.instagram.com/nayandjays/", menu: "" },
    "The Florista": { social: "https://www.facebook.com/thefloristacheyenne", instagram: "https://www.instagram.com/the.florista.cheyenne/", menu: "" },
    "Kiss My Asada": { 
        social: "https://www.facebook.com/profile.php?id=100083163450000", 
        instagram: "https://www.instagram.com/kissmyasada307/", 
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
    const [entries, setEntries] = useState([{
        title: '', date: new Date(), time: '11:00 AM - 2:00 PM', location: '', 
        social_link: '', instagram_link: '', menu_link: '', saved: false
    }]);
    const [loading, setLoading] = useState(false);

    const updateEntry = (index, name, value) => {
        const newEntries = [...entries];
        newEntries[index][name] = value;
        newEntries[index].saved = false;

        if (name === 'title') {
            const match = Object.keys(TRUCK_DIRECTORY).find(k => k.toLowerCase() === value.toLowerCase());
            if (match) {
                newEntries[index].social_link = TRUCK_DIRECTORY[match].social;
                newEntries[index].instagram_link = TRUCK_DIRECTORY[match].instagram || '';
                newEntries[index].menu_link = TRUCK_DIRECTORY[match].menu;
            }
        }
        setEntries(newEntries);
    };

    const saveSingleRow = async (index) => {
        const entry = entries[index];
        if (!entry.title || !entry.location) return;

        const payload = { 
            ...entry, 
            date: formatDateForAPI(entry.date),
            menu_link: entry.menu_link || null,
            instagram_link: entry.instagram_link || null
        };
        
        try {
            const res = await fetch(`${API_BASE_URL}/schedules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const updated = [...entries];
                updated[index].saved = true;
                setEntries(updated);
                onScheduleAdded();
            }
        } catch (err) { console.error("Save failed", err); }
    };

    const duplicateEntry = (index, daysToAdd) => {
        const entryToCopy = { ...entries[index], saved: false };
        const newDate = new Date(entryToCopy.date);
        newDate.setDate(newDate.getDate() + daysToAdd);
        setEntries([...entries, { ...entryToCopy, date: newDate }]);
    };

    const removeEntry = (index) => setEntries(entries.filter((_, i) => i !== index));

    return (
        <div className="modal-backdrop">
            <div className="modal-content vendor-form-modal" style={{ maxWidth: '1200px', width: '98%', padding: '0', borderRadius: '12px', overflow: 'hidden' }}>
                
                <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Truck size={24} color="#667eea" /> Schedule Builder
                    </h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#888' }}><X size={24} /></button>
                </div>

                <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px', background: '#f8fafc' }}>
                    {entries.map((entry, index) => (
                        <div key={index} style={{ 
                            display: 'flex', gap: '10px', alignItems: 'flex-end', 
                            backgroundColor: 'white', padding: '12px 15px', borderRadius: '8px', 
                            border: entry.saved ? '1px solid #4ade80' : '1px solid #e2e8f0',
                            marginBottom: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ flex: 2, minWidth: '150px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Truck Name</label>
                                <input list="truck-list" value={entry.title} onChange={(e) => updateEntry(index, 'title', e.target.value)} placeholder="Search..." style={{ width: '100%', padding: '8px' }} />
                            </div>
                            
                            <div style={{ flex: 2, minWidth: '180px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Address</label>
                                <input value={entry.location} onChange={(e) => updateEntry(index, 'location', e.target.value)} placeholder="123 Street St" style={{ width: '100%', padding: '8px' }} />
                            </div>

                            <div style={{ width: '100px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                <DatePicker selected={entry.date} onChange={(d) => updateEntry(index, 'date', d)} dateFormat="MMM d" className="date-picker-input" />
                            </div>

                            <div style={{ width: '130px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Hours</label>
                                <input value={entry.time} onChange={(e) => updateEntry(index, 'time', e.target.value)} style={{ width: '100%', padding: '8px' }} />
                            </div>

                            {/* NEW SOCIALS/LINK BOXES */}
                            <div style={{ flex: 1, minWidth: '80px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Facebook size={12} /> FB
                                </label>
                                <input value={entry.social_link} onChange={(e) => updateEntry(index, 'social_link', e.target.value)} placeholder="URL" style={{ width: '100%', padding: '8px', fontSize: '12px' }} />
                            </div>

                            <div style={{ flex: 1, minWidth: '80px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Instagram size={12} /> IG
                                </label>
                                <input value={entry.instagram_link} onChange={(e) => updateEntry(index, 'instagram_link', e.target.value)} placeholder="URL" style={{ width: '100%', padding: '8px', fontSize: '12px' }} />
                            </div>

                            <div style={{ flex: 1, minWidth: '80px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={12} /> Web
                                </label>
                                <input value={entry.menu_link} onChange={(e) => updateEntry(index, 'menu_link', e.target.value)} placeholder="URL" style={{ width: '100%', padding: '8px', fontSize: '12px' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '4px', paddingBottom: '2px' }}>
                                <button type="button" onClick={() => saveSingleRow(index)} title="Save row" style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: entry.saved ? '#f0fdf4' : '#fff', color: entry.saved ? '#22c55e' : '#64748b' }}>
                                    {entry.saved ? <CheckCircle size={18} /> : <Save size={18} />}
                                </button>
                                <button type="button" onClick={() => duplicateEntry(index, 1)} title="+1 Day" style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}><Copy size={18} /></button>
                                <button type="button" onClick={() => duplicateEntry(index, 7)} title="+7 Days" style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', background: '#fff' }}><CalendarDays size={18} /></button>
                                {entries.length > 1 && (
                                    <button type="button" onClick={() => removeEntry(index)} style={{ padding: '8px', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={() => setEntries([...entries, { title: '', date: new Date(), time: '11:00 AM - 2:00 PM', location: '', social_link: '', instagram_link: '', menu_link: '', saved: false }])} style={{ width: '100%', padding: '12px', border: '2px dashed #cbd5e0', background: 'none', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontWeight: '500' }}>
                        <Plus size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Add Another Day
                    </button>
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #eee', background: '#fff', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                     <button className="button" style={{ background: '#f1f5f9', color: '#475569', border: 'none' }} onClick={onClose}>Finish</button>
                     <button className="button submit-button" style={{ minWidth: '200px' }} onClick={async () => {
                         setLoading(true);
                         for(let i=0; i<entries.length; i++) { if(!entries[i].saved) await saveSingleRow(i); }
                         setLoading(false);
                     }}>
                        {loading ? 'Publishing...' : 'Publish All to Map'}
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