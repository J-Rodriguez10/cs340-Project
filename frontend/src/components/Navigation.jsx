import { NavLink } from "react-router-dom";


/**
 * Note: I replaced the <a> with <Navlink>
 * Navlinks prevent page reloading and goes hand in hand with React
 */

function Navigation() {
  return (
      <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/screenings">Screenings</NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          <NavLink to="/customers">Customers</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/roles">Roles</NavLink>
          {/* Add more links as your pages grow */}
      </nav>
  );
}

export default Navigation;