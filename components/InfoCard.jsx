import React from "react";

export default function InfoCard({ icon, title, value }) {
  return (
    <div className="flex-1 min-w-[200px] bg-white rounded shadow p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-black">{value}</p>
      </div>
    </div>
  );
}