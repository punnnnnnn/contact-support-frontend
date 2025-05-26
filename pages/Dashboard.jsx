import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Clock, Bell, PlusCircle } from "lucide-react";
import InfoCard from "../components/InfoCard";
import { getTickets, getNotifications, createTicket } from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    getTickets().then(setTickets);
    getNotifications().then(setNotifications);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newTicket = {
      subject,
      description,
      image,
      status: "OPEN",
      department: "Support",
      date: new Date().toISOString(),
    };
    const created = await createTicket(newTicket);
    setTickets([created, ...tickets]);
    setShowForm(false);
    setSubject("");
    setDescription("");
    setImage(null);
  };

  const openTicketDetail = (ticketId) => {
    if (ticketId) {
      navigate(`/ticket/${ticketId}`);
    } else {
      console.error("Invalid ticket ID");
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="ml-auto">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <PlusCircle className="w-4 h-4" /> Create Ticket
          </button>
        </div>
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
                    onClick={() => openTicketDetail(t._id)}
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
                    onClick={() => openTicketDetail(n.ticketId)}
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

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create Ticket</h2>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border rounded px-3 py-2 mb-3"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue"
              className="w-full border rounded px-3 py-2 mb-3"
              rows={4}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
              className="mb-3"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-black px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
