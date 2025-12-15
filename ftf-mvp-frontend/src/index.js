// New/Correct React 18 style
import React from 'react';
import { createRoot } from 'react-dom/client'; // Notice the /client import
import App from './App'; // Or whatever your main component is

const container = document.getElementById('root');
const root = createRoot(container); // Create the root object

root.render( // Render the application
  <React.StrictMode>
    <App />
  </React.StrictMode>
);