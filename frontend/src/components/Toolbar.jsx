import { useLocation } from "react-router-dom";
import { SideMenuIcon } from "../icons/ToolBarIcons";
import ResetButton from "../components/ResetButton";
import GitHubButton from "./GitHubButton";

function Toolbar({ toggleNavbar }) {

  const location = useLocation();
  const path = location.pathname === "/" ? "dashboard" : location.pathname.slice(1);

  return <div className="toolbar">
    {/* Right section of the left bar */}
    <div className="toolbar-left">
      <button className="navbar-toggle-btn" onClick={toggleNavbar}>
        {SideMenuIcon}
      </button>

      <h1 className="toolbar-header">
        <span>CinePictures</span> <span className="spacing">/</span> {path}
      </h1>
    </div>

    {/* Right section of the tool bar */}
    <div className="toolbar-right">
      {/* GitHub Link Button */}
      <GitHubButton />

      {/* Database Reset Button */}
      <ResetButton />
    </div>
  </div>;
}

export default Toolbar;
