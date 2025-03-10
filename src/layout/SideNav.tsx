import React from "react";
import { NavLink } from "react-router-dom";
import { FaStore, FaTag, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import "./SideNav.css";
import MySVG from '../assets/Gsynergy Logo V2 Long Description.svg';

const SideNav: React.FC = () => {
  return (
    <nav className="side-nav">
      <div className="logo-container">
        <img
          className="logo"
          src={MySVG}
          alt="GSynergy Logo"
        />
      </div>
      <ul className="nav-list">
        <li>
          <NavLink
            to="/stores"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaStore className="nav-icon" />
            Store
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sku"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaTag className="nav-icon" />
            SKU
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/planning"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaCalendarAlt className="nav-icon" />
            Planning
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/charts"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <FaChartBar className="nav-icon" />
            Charts
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
