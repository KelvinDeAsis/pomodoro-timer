import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/baloo-2/latin-600.css';
import '@fontsource/baloo-2/latin-700.css';
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-600.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import { AppProvider } from './app/AppContext.jsx';
import App from './app/App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><AppProvider><App /></AppProvider></React.StrictMode>);
