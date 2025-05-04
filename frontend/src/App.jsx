import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';

// Backend port (update this if different)
const backendPort = 3001; // Replace with your actual backend port
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home backendURL={backendURL} />} />
      </Routes>
    </>
  );
}

export default App;
