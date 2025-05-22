import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Navigation from './components/navbar/Navigation';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Screenings from './pages/Screenings';
import Tickets from './pages/Tickets';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import EmployeeRoles from './pages/EmployeeRoles';

// Backend port 
const backendPort = 32849; // Replace with your actual backend port
const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}`;

function App() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const navWidth = 200; 


  return (
    <div className="outer-cont">
      {/* Dynamically display the navbar */}
      {navbarVisible && <Navigation />}

      {/* If the navbar is displayed, push the main content navbar-width away */}
      <main
        style={{
          flexGrow: 1,
          paddingLeft: navbarVisible ? `${navWidth}px` : '0',
          transition: 'padding-left 0.1s linear'
        }}

        className="main-cont"

      >
        <Routes>
          <Route path="/" element={<Home backendURL={backendURL} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/screenings" element={<Screenings />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/roles" element={<EmployeeRoles />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
