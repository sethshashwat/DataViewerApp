// src/layout/Layout.tsx
import React from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  children?: React.ReactNode;  // make children optional
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: "flex", minWidth: "1080px", height: "100vh" }}>
      <SideNav />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopNav />
        <div style={{ flex: 1, padding: "1rem" }}>
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
