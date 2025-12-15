// src/components/MapDisplay.js
import React, { useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

// Center the map on Cheyenne, WY (based on the test data coordinates)
const defaultCenter = {
    lat: 41.1400,
    lng: -104.8200
};

// Map container style (must have a defined height)
const containerStyle = {
    width: '100%',
    height: '100%',
};

// Map options to keep it clean and focused
const mapOptions = {
    disableDefaultUI: true, // Hides buttons like street view, satellite, etc.
    zoomControl: true,       // Keeps zoom controls visible
};

function MapDisplay({ schedules, onMarkerClick, selectedId }) {
    // Libraries needed for the map (only 'places' is strictly needed for search, but not for markers)
    const libraries = ['places']; 
    
    // Loads the Google Maps script using the key you set in Vercel's environment variables
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_KEY,
        libraries,
    });

    const mapRef = React.useRef(null);
    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(function callback(map) {
        mapRef.current = null;
    }, []);

    if (loadError) {
        return <div className="status-message error">Error loading map: Check your REACT_APP_MAPS_KEY environment variable.</div>;
    }

    if (!isLoaded) {
        return <div className="status-message">Loading Map...</div>;
    }

    return (
        <div style={{ flex: 1, minHeight: '500px', backgroundColor: '#e6e6e6' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={14} // Zoom level to fit the Cheyenne downtown area
                options={mapOptions}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Loop through all scheduled trucks and place a marker for each one */}
                {schedules.map(schedule => (
                    <Marker
                        key={schedule.id}
                        position={{ 
                            lat: Number(schedule.latitude), // Ensure coordinates are treated as numbers
                            lng: Number(schedule.longitude) 
                        }}
                        onClick={() => onMarkerClick(schedule)}
                        // Use a custom icon or style to highlight the selected truck
                        icon={{
                            url: selectedId === schedule.id ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32),
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    );
}

export default MapDisplay;