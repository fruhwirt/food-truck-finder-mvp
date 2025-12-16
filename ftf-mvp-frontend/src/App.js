// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import MapDisplay from './components/MapDisplay';
import DateFilter from './components/DateFilter';
import VendorForm from './components/VendorForm'; // 1. IMPORT
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
    const [showVendorForm, setShowVendorForm] = useState(false); // 2. ADD STATE

    const fetchSchedules = async (date) => {
        setLoading(true);
        setError(null);
        setSelectedSchedule(null);

        const dateString = formatDate(date);
        // Use environment variable for API URL
        const apiUrl = process.env.REACT_APP_API_URL || '/api/v1';
        const endpoint = `${apiUrl}/schedules?date=${dateString}`;

        console.log('Fetching from:', endpoint);

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`API fetch failed with status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched schedules:', data);
            setSchedules(data);
        } catch (err) {
            console.error('Fetch Error:', err);
            setError("Failed to load schedules. Please try again later.");
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

// --- [START] HANDLER FOR NEW SCHEDULE ---
    const handleScheduleAdded = (newSchedule) => {
        // If the new schedule is for the currently viewed date, add it to the list
        if (formatDate(new Date(newSchedule.date)) === formatDate(selectedDate)) {
            setSchedules(prev => [...prev, newSchedule]);
        }
        setShowVendorForm(false); // Close the form
    };
    // --- [END] HANDLER FOR NEW SCHEDULE ---

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
                <DateFilter onDateChange={handleDateChange} currentDate={selectedDate} />
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
                        />
                        <DetailPanel schedule={selectedSchedule} />
                    </>
                )}
            </main>
            
	    {/* 4. VENDOR FORM MODAL */}
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