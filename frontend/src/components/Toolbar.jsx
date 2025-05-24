import { useLocation } from "react-router-dom";
import { SideMenuIcon } from "../icons/ToolBarIcons";
import ResetButton from "../components/ResetButton";

function Toolbar({ toggleNavbar }) {

  const location = useLocation();
  const path = location.pathname === "/" ? "dashboard" : location.pathname.slice(1);

  return <div className="toolbar">
    
    <div className="toolbar-left">
      <button className="navbar-toggle-btn" onClick={toggleNavbar}>
        {SideMenuIcon}
      </button>

      <h1 className="toolbar-header">
        <span>CinePictures</span> <span className="spacing">/</span> {path}
      </h1>
    </div>

    {/* Databse Rest Button */}
    <div className="toolbar-right">
      <ResetButton />
    </div>
  </div>;
}

export default Toolbar;
