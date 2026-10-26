import { NavLink } from "react-router-dom";
import "../../src/styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <NavLink
        to="/"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/students"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        Students
      </NavLink>

      <NavLink
        to="/attendance"
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        Attendance
      </NavLink>

    </div>
  );
}

export default Navbar;