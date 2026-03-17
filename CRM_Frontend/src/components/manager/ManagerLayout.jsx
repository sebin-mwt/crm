import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import ManagerHeader from './ManagerHeader';

function ManagerLayout() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <ManagerSidebar />

      <div style={{ flex: 5, background: "#f8f9fa" }}>
        <ManagerHeader />

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ManagerLayout;