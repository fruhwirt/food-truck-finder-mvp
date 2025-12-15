import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';  // ✅ Import App.js instead of FoodTruckFinder.js

const container = document.getElementById('root');

// 1. Create the root object using the new React 18 API
const root = createRoot(container); 

// 2. Render your application
root.render(
  <React.StrictMode>
    <App /> {/*Render updated app */}
  </React.StrictMode>
);