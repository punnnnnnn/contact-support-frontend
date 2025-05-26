import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TicketDetail from "./pages/TicketDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTicketDetail from "./pages/AdminTicketDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ticket/:id" element={<AdminTicketDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
