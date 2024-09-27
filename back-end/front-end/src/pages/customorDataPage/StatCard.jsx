import React from "react";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        <span>건</span>
      </div>
    </div>
  );
}

export default StatCard;
