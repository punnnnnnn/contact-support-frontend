const API_URL = import.meta.env.VITE_API_URL;

// ดึง ticket ทั้งหมด
export const getTickets = async () => {
  const res = await fetch(`${API_URL}/tickets`);
  const data = await res.json();
  console.log("Tickets from server:", data);
  return data;
};

// สร้าง ticket ใหม่
export const createTicket = async (ticket) => {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticket),
  });
  return res.json();
};

// ดึง ticket ตาม ID
export const getTicketById = async (id) => {
  const res = await fetch(`${API_URL}/tickets/${id}`);
  return res.json();
};

// อัปเดตสถานะ ticket
export const updateTicketStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/tickets/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

// ปิด ticket
export const closeTicket = async (id) => {
  const res = await fetch(`${API_URL}/tickets/${id}/close`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

// ดึงข้อความทั้งหมดของ ticket
export const getMessages = async (ticketId) => {
  const res = await fetch(`${API_URL}/messages/${ticketId}`);
  return res.json();
};

// ส่งข้อความใหม่
export const sendMessage = async (message) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  return res.json();
};

// ดึงการแจ้งเตือนทั้งหมด
export const getNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`);
  return res.json();
};
