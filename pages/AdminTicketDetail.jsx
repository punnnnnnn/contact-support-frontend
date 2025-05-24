import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMessages, sendMessage, updateTicketStatus } from "../api";

export default function AdminTicketDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const data = await getMessages(ticket._id);
    setMessages(data);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    const newMsg = {
      ticketId: ticket._id,
      sender: "Admin", // ฝั่งแอดมิน
      message: text,
      image,
      date: new Date().toISOString(),
    };
    await sendMessage(newMsg);
    setText("");
    setImage(null);
    fetchMessages();
  };

  const handleClose = async () => {
    await updateTicketStatus(ticket._id, "CLOSED");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate("/")} className="mb-4 text-blue-500 hover:underline">
        ← Back
      </button>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">{ticket.subject}</h2>
        <p className="mb-2">{ticket.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Status: {ticket.status} <br />
          Created at: {new Date(ticket.date).toLocaleString()}
        </p>
        {ticket.status === "OPEN" && (
          <button onClick={handleClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Close Ticket
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h3 className="font-bold mb-3">Messages</h3>
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === "Admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="bg-gray-200 p-2 rounded max-w-xs">
                {msg.message && <p>{msg.message}</p>}
                {msg.image && (
                  <img src={msg.image} alt="attachment" className="mt-2 rounded" />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender} - {new Date(msg.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        {ticket.status === "OPEN" && (
          <form onSubmit={handleSend} className="mt-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message"
              className="w-full border rounded px-3 py-2 mb-2"
              rows={3}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
              className="mb-2"
            />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded w-full">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
