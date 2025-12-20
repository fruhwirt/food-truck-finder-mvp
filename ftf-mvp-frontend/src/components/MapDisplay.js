// src/components/MapDisplay.js
import React, { useCallback, useRef } from 'react';
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

// UPDATED: Added styles to hide business popups and POI labels
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false, 
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

function MapDisplay({ schedules, onMarkerClick, selectedId, onBoundsChange }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_KEY,
        libraries: ['places'],
    });

    const mapRef = useRef(null);

    // This solves the incorrect truck count. 
    // It only triggers when the map finishes moving/zooming.
    const handleIdle = () => {
        if (!mapRef.current || !onBoundsChange) return;
        
        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        // Filter ONLY the trucks physically inside the user's current view
        const visible = schedules.filter(s => 
            bounds.contains({ lat: Number(s.latitude), lng: Number(s.longitude) })
        );
        
        onBoundsChange(visible);
    };

    if (loadError) return <div className="status-message">Error loading maps</div>;
    if (!isLoaded) return <div className="status-message">Loading Map...</div>;

    return (
        <div style={{ flex: 1, minHeight: '500px', backgroundColor: '#e6e6e6' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={14}
                options={mapOptions}
                onLoad={(map) => { mapRef.current = map; }}
                onIdle={handleIdle} // Trigger logic to update the right-side list
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