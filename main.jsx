import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketDetail from "./pages/TicketDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTicketDetail from "./pages/AdminTicketDetail";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ticket/:id" element={<AdminTicketDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
