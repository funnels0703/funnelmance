import React, { useState, useEffect } from "react";
import axios from "axios";

function TabComponent() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [name, setName] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const dummyData = {
      hospital: [
        { id: 1, name: "병원 A" },
        { id: 2, name: "병원 B" },
      ],
      event: [
        { id: 1, name: "이벤트 C" },
        { id: 2, name: "이벤트 D" },
      ],
      advertising_company: [
        { id: 1, name: "매체 E" },
        { id: 2, name: "매체 F" },
      ],
    };
    setData(dummyData[activeTab]);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setName("");
  };

  const handleSubmit = async () => {
    const urls = {
      hospital: "/api/hospitals",
      event: "/api/events",
      advertising_company: "/api/advertising_company",
    };

    try {
      const response = await axios.post(urls[activeTab], { name });
      console.log("데이터가 성공적으로 전송되었습니다:", response.data);
      alert("데이터가 성공적으로 전송되었습니다.");
      setData((prev) => [...prev, { id: prev.length + 1, name }]);
    } catch (error) {
      console.error("데이터 전송 오류:", error);
      alert("데이터 전송에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "hospital" ? "active" : ""}`}
          onClick={() => handleTabChange("hospital")}
        >
          병원 추가
        </button>
        <button
          className={`tab ${activeTab === "event" ? "active" : ""}`}
          onClick={() => handleTabChange("event")}
        >
          이벤트 추가
        </button>
        <button
          className={`tab ${
            activeTab === "advertising_company" ? "active" : ""
          }`}
          onClick={() => handleTabChange("advertising_company")}
        >
          매체 추가
        </button>
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleSubmit}>제출</button>
      </div>
      <div className="data-list">
        {data.map((item) => (
          <div key={item.id} className="data-item">
            ID: {item.id}, 이름: {item.name}
          </div>
        ))}
      </div>
      <style jsx>{`
        .container {
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          background-color: #ffffff;
          text-align: center;
          font-family: "Arial", sans-serif;
        }
        .tabs {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
        }
        .tab {
          flex-grow: 1;
          padding: 14px;
          cursor: pointer;
          background-color: #f1f1f1;
          color: #333;
          font-size: 15px;
          border-radius: 10px;
          border: none;
          transition: background-color 0.3s, color 0.3s;
        }
        .tab.active {
          background-color: #007bff;
          color: white;
        }
        .tab:not(.active):hover {
          background-color: #e0e0e0;
        }
        .form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        input {
          width: 90%;
          padding: 12px;
          margin-bottom: 20px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
        }
        button {
          width: 70%;
          padding: 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #0056b3;
        }
        .data-list {
          margin-top: 25px;
        }
        .data-item {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default TabComponent;
