import { useLocation } from "react-router-dom";

function Navlink({ icon, label, href }) {
  // const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <a
      href={href}
      className={`navlink-anchor${isActive ? " active" : ""}`}
    >
      <div className="navlink-icon">{icon}</div>
      <p className="navlink-label">{label}</p>
    </a>
  );
}

export default Navlink;
