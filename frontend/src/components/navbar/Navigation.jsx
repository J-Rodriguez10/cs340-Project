import { CustomerIcon, EmployeeRolesIcon, EmployeesIcon, PieChartIcon, ScreeningIcon, TicketIcon } from "../../icons/NavbarIcons";
import Navlink from "./Navlink";

function Navigation() {
  return (
    <nav>
      {/* Logo */}
      <div className="logo-cont">
        <img className="logo-pic" src="/src/images/cinepictures-logo-white.png"/>
      </div>
      
      {/* Links */}
      <Navlink href="/" label="Dashboard" icon={PieChartIcon} />
      <Navlink href="/customers" label="Customers" icon={CustomerIcon} />
      <Navlink href="/screenings" label="Screenings" icon={ScreeningIcon} />
      <Navlink href="/tickets" label="Tickets" icon={TicketIcon} />
      <Navlink href="/employees" label="Employees" icon={EmployeesIcon} />
      <Navlink href="/roles" label="Roles" icon={EmployeeRolesIcon} />
    
    </nav>
  );
}

export default Navigation;