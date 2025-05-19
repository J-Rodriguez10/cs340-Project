/**
 * Note: I replaced the <a> with <Navlink>
 * Navlinks prevent page reloading and goes hand in hand with React
 * 
 * May 7th 2025: Jesus Swapped them back to <a> for purpose of following 
 * more closely the boilerplate code in order to prevent any potential bugs.
 */

import ResetButton from "./ResetButton";

function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/movies">Movies</a>
      <a href="/screenings">Screenings</a>
      <a href="/tickets">Tickets</a>
      <a href="/customers">Customers</a>
      <a href="/employees">Employees</a>
      <a href="/roles">Roles</a>
      {/* Add more links as your pages grow */}
      
      <ResetButton />
    </nav>
  );
}

export default Navigation;