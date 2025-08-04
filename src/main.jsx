import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);