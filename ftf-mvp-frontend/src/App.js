// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import MapDisplay from './components/MapDisplay';
import DateFilter from './components/DateFilter';
import VendorForm from './components/VendorForm';
import DetailPanel from './components/DetailPanel';
import { Plus } from 'lucide-react';

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function App() {
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showVendorForm, setShowVendorForm] = useState(false);
    const [visibleSchedules, setVisibleSchedules] = useState([]); // Tracks trucks currently in map view

    const fetchSchedules = async (date) => {
    	setLoading(true);
    	setError(null);
    	setSelectedSchedule(null);
    	setVisibleSchedules([]);

        const dateString = formatDate(date);
        const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
        const endpoint = `${apiUrl}/schedules?date=${dateString}`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`API fetch failed with status: ${response.status}`);
            }
            const data = await response.json();
            setSchedules(data);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError("Failed to load schedules. Please try again later.");
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleAdded = (newSchedule) => {
        if (formatDate(new Date(newSchedule.date)) === formatDate(selectedDate)) {
            setSchedules(prev => [...prev, newSchedule]);
        }
        setShowVendorForm(false);
    };

    useEffect(() => {
        fetchSchedules(selectedDate);
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleMarkerClick = (schedule) => {
        setSelectedSchedule(schedule);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>🚚 Food Truck Finder</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <DateFilter onDateChange={handleDateChange} currentDate={selectedDate} />
                    <button 
                        className="add-truck-button"
                        onClick={() => setShowVendorForm(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#4ade80',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        <Plus size={18} style={{ marginRight: '6px' }} /> Add Your Truck
                    </button>
                </div>
            </header>

            <main className="main-content">
                {loading && <div className="status-message">Loading schedules...</div>}
                {error && <div className="status-message error">{error}</div>}
                
                {!loading && !error && schedules.length === 0 && (
                    <div className="no-trucks-message">
                        <p>No food trucks scheduled for this date.</p>
                    </div>
                )}
                
                {!loading && schedules.length > 0 && (
                    <>
                        <MapDisplay 
                            schedules={schedules} 
                            onMarkerClick={handleMarkerClick} 
                            selectedId={selectedSchedule?.id}
                            onBoundsChange={setVisibleSchedules} // Updates the live list as user pans
                        />
                        <DetailPanel 
                            schedule={selectedSchedule} 
                            visibleSchedules={visibleSchedules} // Shows trucks in view frame
                            onSelect={handleMarkerClick}       // Allows list clicking to select pin
                        />
                    </>
                )}
            </main>
            
            {showVendorForm && (
                <VendorForm
                    onScheduleAdded={handleScheduleAdded}
                    onClose={() => setShowVendorForm(false)}
                />
            )}
        </div>
    );
}

export default App;