// src/components/DetailPanel.js
import React from 'react';
import { MapPin, Clock, ExternalLink, Menu } from 'lucide-react';

const DetailPanel = ({ schedule }) => {
    // Render nothing if no truck is selected
    if (!schedule) {
        return (
            <aside className="detail-panel" style={{ flexBasis: '350px', padding: '20px', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ color: '#764ba2' }}>Food Truck Details</h3>
                <p style={{ marginTop: '15px', color: '#777' }}>
                    Select a truck on the map to view its schedule and links.
                </p>
            </aside>
        );
    }

    // Render details for the selected truck
    return (
        <aside className="detail-panel" style={{ flexBasis: '350px', padding: '20px', backgroundColor: '#fff', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>{schedule.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', color: '#555' }}>
                <MapPin size={18} style={{ marginRight: '10px', minWidth: '18px', color: '#764ba2' }} />
                <p style={{ margin: 0 }}>
                    <strong>Location:</strong> {schedule.location}
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', color: '#555' }}>
                <Clock size={18} style={{ marginRight: '10px', minWidth: '18px', color: '#764ba2' }} />
                <p style={{ margin: 0 }}>
                    <strong>Time:</strong> {schedule.time}
                </p>
            </div>

            <div className="links">
                <a href={schedule.social_link} target="_blank" rel="noopener noreferrer" className="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ExternalLink size={18} style={{ marginRight: '8px' }} /> View Socials
                </a>
                {schedule.menu_link && (
                    <a href={schedule.menu_link} target="_blank" rel="noopener noreferrer" className="button menu-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Menu size={18} style={{ marginRight: '8px' }} /> View Menu
                    </a>
                )}
            </div>
        </aside>
    );
};

export default DetailPanel;