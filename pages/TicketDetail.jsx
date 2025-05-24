import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, getMessages, sendMessage, updateTicketStatus } from "../api";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);

  // ดึง ticket และ messages จาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketData = await getTicketById(id);
        if (!ticketData) {
          console.error("Ticket not found");
          return;
        }
        setTicket(ticketData);

        const messagesData = await getMessages(id);
        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleSend = async () => {
    if (!newMessage && !image) return;

    const messageData = {
      ticketId: id,
      text: newMessage,
      image,
      sender: "User",
      date: new Date().toISOString(),
    };
    const sent = await sendMessage(messageData);
    setMessages([...messages, sent]);
    setNewMessage("");
    setImage(null);
  };

  const handleCloseTicket = async () => {
    await updateTicketStatus(id, "CLOSED");
    setTicket({ ...ticket, status: "CLOSED" });
  };

  if (!ticket) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <button onClick={() => navigate("/")} className="text-gray-500 hover:underline text-2xl mb-4">
        &larr; Back
      </button>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-xl font-bold mb-4">{ticket.subject}</h1>
        <p className="mb-2">{ticket.description}</p>
        {ticket.image && <img src={ticket.image} alt="Attached" className="max-w-xs mb-4" />}
        <p className="text-sm text-gray-500">Status: {ticket.status}</p>
        <p className="text-sm text-gray-500 mb-4">Created at: {new Date(ticket.date).toLocaleString()}</p>
        {ticket.status === "OPEN" && (
          <button onClick={handleCloseTicket} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            Close Ticket
          </button>
        )}

        {/* Chat Area */}
        <div className="mt-6">
          <h2 className="font-bold mb-2">Messages</h2>
          <div className="space-y-3 mb-4 h-96 overflow-y-auto bg-gray-50 p-3 rounded">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded max-w-[70%] ${
                  msg.sender === "User" ? "bg-gray-200 ml-auto text-right" : "bg-gray-300 mr-auto text-left"
                }`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && <img src={msg.image} alt="Chat attachment" className="max-w-xs mt-2" />}
                <p className="text-xs text-gray-500 mt-1">
                  {msg.sender} - {new Date(msg.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          {ticket.status === "OPEN" ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message"
                className="border rounded px-3 py-2"
              />
              <input type="file" accept="image/*" onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))} />
              <button onClick={handleSend} className="bg-gray-900 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic">This ticket is closed. You can no longer send messages.</p>
          )}
        </div>
      </div>
    </div>
  );
}
