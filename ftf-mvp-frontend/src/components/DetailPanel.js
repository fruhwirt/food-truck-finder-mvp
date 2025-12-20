// src/components/DetailPanel.js
import React from 'react';
import { MapPin, Clock, Facebook, Instagram, Globe } from 'lucide-react';

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

    return (
        <aside className="detail-panel" style={{ flexBasis: '350px', padding: '20px', backgroundColor: '#fff', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>{schedule.title}</h2>
            
            {/* Location Section */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', color: '#555' }}>
                <MapPin size={18} style={{ marginRight: '10px', minWidth: '18px', color: '#764ba2' }} />
                <p style={{ margin: 0 }}>
                    <strong>Location:</strong> {schedule.location}
                </p>
            </div>

            {/* Time Section */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px', color: '#555' }}>
                <Clock size={18} style={{ marginRight: '10px', minWidth: '18px', color: '#764ba2' }} />
                <p style={{ margin: 0 }}>
                    <strong>Time:</strong> {schedule.time}
                </p>
            </div>

            {/* NEW ICON-BASED SOCIALS SECTION */}
            <div className="social-actions" style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '20px', 
                height: '45px' 
            }}>
                {/* Facebook Button (The "f") */}
                {schedule.social_link && (
                    <a href={schedule.social_link} target="_blank" rel="noopener noreferrer" 
                       style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1877F2', color: 'white', borderRadius: '8px' }}
                       title="Facebook">
                        <Facebook size={22} strokeWidth={2.5} />
                    </a>
                )}

                {/* Instagram Button (The "camera lens") */}
                {schedule.instagram_link && (
                    <a href={schedule.instagram_link} target="_blank" rel="noopener noreferrer" 
                       style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', borderRadius: '8px' }}
                       title="Instagram">
                        <Instagram size={22} strokeWidth={2.5} />
                    </a>
                )}

                {/* Website Button (The "wire frame globe") */}
                {schedule.menu_link && (
                    <a href={schedule.menu_link} target="_blank" rel="noopener noreferrer" 
                       style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4a5568', color: 'white', borderRadius: '8px' }}
                       title="Website / Menu">
                        <Globe size={22} strokeWidth={2.5} />
                    </a>
                )}
            </div>
        </aside>
    );
};

export default DetailPanel;