import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Clock, Bell } from "lucide-react";
import InfoCard from "../components/InfoCard";
import { getTickets, getNotifications } from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // โหลด tickets และ notifications จาก backend
  useEffect(() => {
    getTickets().then(setTickets);
    getNotifications().then(setNotifications);
  }, []);

  const openTicketDetail = (ticket) => navigate(`/admin/ticket/${ticket._id}`, { state: ticket });
  const openCount = tickets.filter((t) => t.status === "OPEN").length;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <InfoCard icon={<Ticket className="text-blue-500" />} title="Total Tickets" value={tickets.length} />
        <InfoCard icon={<Clock className="text-yellow-500" />} title="Pending Tickets" value={openCount} />
        <div onClick={() => setShowNotifications(true)} className="cursor-pointer flex-1 min-w-[200px] bg-white rounded shadow p-4 flex items-center gap-3 hover:bg-gray-50">
          <Bell className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">New Notifications</p>
            <p className="font-semibold text-black">{notifications.length}</p>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-sm text-left">
          <thead className="border-b font-bold text-gray-600">
            <tr>
              <th className="px-3 py-2">Ticket #</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Department</th>
              <th className="px-3 py-2">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="px-3 py-2">{t._id.slice(-6)}</td>
                <td className="px-3 py-2">{t.subject}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 text-xs rounded ${t.status === "OPEN" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2">{t.department}</td>
                <td className="px-3 py-2">{new Date(t.date).toLocaleString()}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => openTicketDetail(t)}
                    className="text-gray-500 hover:underline text-2xl"
                  >
                    &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Notifications</h2>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              {notifications.map((n) => (
                <li key={n._id} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-gray-500">{new Date(n.date).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/ticket/${n.ticketId}`)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    {n.ticketId.slice(-6)}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowNotifications(false)}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
