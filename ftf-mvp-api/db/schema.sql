-- DDL Script for Food Truck Finder MVP
-- Creates the 'schedules' table which stores the truck's location and details.

CREATE TABLE schedules (
    -- Primary Key
    id SERIAL PRIMARY KEY,

    -- Truck/Event Details
    title VARCHAR(255) NOT NULL,
    social_link VARCHAR(255) NOT NULL, -- Link to Instagram/Facebook/Website
    menu_link VARCHAR(255),            -- Optional link to the menu

    -- Schedule Information
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,         -- Stored as a string (e.g., '11:00 AM - 2:00 PM')

    -- Location Data (Raw Address + Geocoded Coordinates)
    location VARCHAR(255) NOT NULL,    -- The human-readable address (e.g., '123 Main St, Denver, CO')
    latitude NUMERIC(10, 7) NOT NULL,  -- Geocoded latitude (for the map markers)
    longitude NUMERIC(10, 7) NOT NULL  -- Geocoded longitude (for the map markers)
);

-- Optional: Create an index on the date column for faster lookups when filtering
CREATE INDEX idx_schedules_date ON schedules(date);