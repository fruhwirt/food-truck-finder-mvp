import React from 'react';
import { createRoot } from 'react-dom/client';
// FIX: Import the correct component name (FoodTruckFinder)
import FoodTruckFinder from './FoodTruckFinder'; 

const container = document.getElementById('root');

// 1. Create the root object using the new React 18 API
const root = createRoot(container); 

// 2. Render your application
root.render(
  <React.StrictMode>
    <FoodTruckFinder />
  </React.StrictMode>
);