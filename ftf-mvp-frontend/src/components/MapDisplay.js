// src/components/MapDisplay.js
import React, { useCallback } from 'react';
import { GoogleMap, OverlayView, useLoadScript } from '@react-google-maps/api';
import { Truck } from 'lucide-react';

const defaultCenter = {
    lat: 41.1400,
    lng: -104.8200
};

const containerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false, 
};

function MapDisplay({ schedules, onMarkerClick, selectedId }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_KEY,
        libraries: ['places'],
    });

    const mapRef = React.useRef(null);
    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
    }, []);

    if (loadError) return <div className="status-message">Error loading maps</div>;
    if (!isLoaded) return <div className="status-message">Loading Map...</div>;

    return (
        <div style={{ flex: 1, minHeight: '500px', backgroundColor: '#e6e6e6' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={14}
                options={mapOptions}
                onLoad={onLoad}
            >
                {schedules.map(schedule => (
                    <OverlayView
                        key={schedule.id}
                        position={{ 
                            lat: Number(schedule.latitude), 
                            lng: Number(schedule.longitude) 
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        {/* THE NIFTY TRUCK PIN */}
                        <div 
                            className={`custom-truck-pin ${selectedId === schedule.id ? 'selected' : ''}`}
                            onClick={() => onMarkerClick(schedule)}
                        >
                            <Truck size={18} />
                            <div className="pin-point"></div>
                        </div>
                    </OverlayView>
                ))}
            </GoogleMap>
        </div>
    );
}

export default MapDisplay;