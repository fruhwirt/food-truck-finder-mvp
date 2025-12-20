// src/components/DetailPanel.js
import React from 'react';
import { MapPin, Clock, Facebook, Instagram, Globe, ChevronRight } from 'lucide-react';

const DetailPanel = ({ schedule, visibleSchedules, onSelect }) => {
    
    // 1. DETAIL VIEW (When a truck is clicked)
    if (schedule) {
        return (
            <aside className="detail-panel" style={{ flexBasis: '350px', padding: '20px', backgroundColor: '#fff', borderLeft: '1px solid #ddd' }}>
                <button onClick={() => onSelect(null)} style={{ border: 'none', background: 'none', color: '#667eea', cursor: 'pointer', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                    ← BACK TO LIST
                </button>
                <h2 style={{ color: '#333', marginBottom: '15px' }}>{schedule.title}</h2>
                
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', color: '#555', fontSize: '14px' }}>
                        <MapPin size={16} color="#764ba2" /> <strong>{schedule.location}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: '#555', fontSize: '14px', marginTop: '5px' }}>
                        <Clock size={16} color="#764ba2" /> {schedule.time}
                    </div>
                </div>

                {/* The Social Icons we built earlier */}
                <div style={{ display: 'flex', gap: '8px', height: '40px', marginTop: '20px' }}>
                    {schedule.social_link && <a href={schedule.social_link} target="_blank" className="social-icon-btn facebook"><Facebook size={20} /></a>}
                    {schedule.instagram_link && <a href={schedule.instagram_link} target="_blank" className="social-icon-btn instagram"><Instagram size={20} /></a>}
                    {schedule.menu_link && <a href={schedule.menu_link} target="_blank" className="social-icon-btn website"><Globe size={20} /></a>}
                </div>
            </aside>
        );
    }

    // 2. LIST VIEW (Default - All trucks in view)
    return (
        <aside className="detail-panel" style={{ flexBasis: '350px', padding: '0', backgroundColor: '#f8fafc', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #eee' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1a202c' }}>Trucks in this area</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>{visibleSchedules.length} trucks found</p>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '10px' }}>
                {visibleSchedules.map(truck => (
                    <div 
                        key={truck.id} 
                        onClick={() => onSelect(truck)}
                        style={{ 
                            background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '10px',
                            cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'transform 0.1s',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                        className="truck-card-hover"
                    >
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', color: '#2d3748' }}>{truck.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#718096' }}>
                                <MapPin size={12} /> {truck.location.split(',')[0]} {/* Just show street name */}
                            </div>
                        </div>
                        <ChevronRight size={18} color="#cbd5e0" />
                    </div>
                ))}
                
                {visibleSchedules.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#a0aec0' }}>
                        <p>Move the map to find trucks nearby.</p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default DetailPanel;