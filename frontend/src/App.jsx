import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navigation from './components/Navigation';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Screenings from './pages/Screenings';
import Tickets from './pages/Tickets';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import EmployeeRoles from './pages/EmployeeRoles';

// Backend port (update this if different)
const backendPort = 32849; // Replace with your actual backend port
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home backendURL={backendURL} />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/screenings" element={<Screenings />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/roles" element={<EmployeeRoles />} />
      </Routes>
    </>
  );
}

export default App;
