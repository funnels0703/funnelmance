import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomorDataPage() {
  const [customors, setCustomors] = useState([]); // 모든 데이터를 저장하는 배열
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/customor`);
        if (response.data.length > 0) {
          setCustomors(response.data); // 데이터를 배열로 저장
        } else {
          setError("데이터가 없습니다.");
        }
        setLoading(false); // 로딩 상태 해제
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false); // 오류 발생 시에도 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setCustomors((prevCustomors) =>
      prevCustomors.map((customor, i) =>
        i === index ? { ...customor, [name]: value } : customor
      )
    );
  };

  const handleSubmit = async (index) => {
    const customor = customors[index];
    try {
      const response = await axios.put(
        `/api/customor/${customor.id}`,
        customor
      );
      console.log("Data updated successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>고객 데이터</h2>
      <div className="card-container">
        {customors.map((customor, index) => (
          <div key={customor.id} className="card">
            <div className="input-group">
              <label>이름:</label>
              <input
                type="text"
                name="name"
                value={customor.name || ""}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>전화번호:</label>
              <input
                type="tel"
                name="phone"
                value={customor.phone || ""}
                onChange={(e) => handleInputChange(e, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>병원명:</label>
              <input
                type="text"
                name="hospital_name"
                value={customor.url_code_setting?.hospital_name || ""}
                readOnly
              />
            </div>
            <div className="input-group">
              <label>광고 제목:</label>
              <input
                type="text"
                name="ad_title"
                value={customor.url_code_setting?.ad_title || ""}
                readOnly
              />
            </div>
            <div className="input-group">
              <label>1차 예약 상태:</label>
              <input
                type="text"
                name="initial_status"
                value={customor.initial_status || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>부재 횟수:</label>
              <input
                type="number"
                name="no_answer_count"
                value={customor.no_answer_count || 0}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>재통화 요청일:</label>
              <input
                type="date"
                name="recall_request_at"
                value={customor.recall_request_at?.split("T")[0] || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>예약일:</label>
              <input
                type="date"
                name="reservation_date"
                value={customor.reservation_date?.split("T")[0] || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>방문 상태:</label>
              <input
                type="text"
                name="visit_status"
                value={customor.visit_status || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>배당 여부:</label>
              <input
                type="text"
                name="dividend_status"
                value={customor.dividend_status || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="input-group">
              <label>일자:</label>
              <input
                type="date"
                name="date"
                value={customor.date?.split("T")[0] || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <button
              className="submit-button"
              onClick={() => handleSubmit(index)}
            >
              수정하기
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
          white-space: nowrap;
        }

        h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        .card-container {
          display: flex;
          flex-wrap: nowrap;
          gap: 20px;
        }

        .card {
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 20px;
          min-width: 300px;
          max-width: 300px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: inline-block;
          vertical-align: top;
        }

        .input-group {
          margin-bottom: 10px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        input {
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .submit-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default CustomorDataPage;
