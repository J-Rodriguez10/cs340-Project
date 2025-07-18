import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';


// STYLES:
import './styles/index.css'; 
import './styles/navbar.css'; 
import './styles/generic-list.css'; 
import './styles/toolbar.css'; 
import './styles/buttons.css'; 
import './styles/home.css'; 



import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
