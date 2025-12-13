import React from 'react';
import ReactDOM from 'react-dom/client'; // or 'react-dom' if older version
import FoodTruckFinder from './FoodTruckFinder'; // Import your main component

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <FoodTruckFinder />
  </React.StrictMode>
);