import React from 'react';
import { createRoot } from 'react-dom/client'; // Notice the /client import
import FoodTruckFinder from './FoodTruckFinder'; // Assuming this is your main component
import reportWebVitals from './reportWebVitals';

// 1. Get the root DOM element
const container = document.getElementById('root');

// 2. Create the root object using the new API
const root = createRoot(container); 

// 3. Render your application
root.render(
  <React.StrictMode>
    <FoodTruckFinder />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// ok
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();