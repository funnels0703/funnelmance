import React from "react";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        <span>건</span>
      </div>

      <style jsx>{`
        .stat-card {
          width: 283px;
          display: flex;
          flex-direction: column;
          div {
            text-align: center;
          }

          .stat-label {
            color: #202224;
            font-size: 22px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            width: 82%;
          }

          .stat-value {
            color: var(--primary-500, #004fc6);
            font-size: 60px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }

          span {
            color: var(--primary-500, #004fc6);
            font-size: 22px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
        }
      `}</style>
    </div>
  );
}

export default StatCard;
