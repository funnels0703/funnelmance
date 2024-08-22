import React, { useEffect, useState } from "react";
import axios from "axios";

function CodePage() {
  const [customors, setCustomors] = useState([]);
  const [editState, setEditState] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/customor`);
      if (response.data.length > 0) {
        setCustomors(
          response.data.map((customor) => ({ ...customor, isSelected: false }))
        );
        const initialState = {};
        response.data.forEach((item) => {
          initialState[item.id] = false; // 각 아이템 ID에 대해 수정 상태를 false로 초기화
        });
        setEditState(initialState);
      } else {
        setError("데이터가 없습니다.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setCustomors((prevCustomors) =>
      prevCustomors.map((customor, i) =>
        i === index ? { ...customor, [name]: value } : customor
      )
    );
  };

  const handleCheckboxChange = (index) => {
    setCustomors((prevCustomors) =>
      prevCustomors.map((customor, i) =>
        i === index
          ? { ...customor, isSelected: !customor.isSelected }
          : customor
      )
    );
  };

  const handleEdit = (id) => {
    setEditState((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = async (index) => {
    const customor = customors[index];
    try {
      const response = await axios.put(
        `/api/customor/${customor.id}`,
        customor
      );
      console.log("Data updated successfully:", response.data);
      setEditState((prev) => ({ ...prev, [customor.id]: false }));
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleUpdateStatusClick = async () => {
    const selectedIds = customors
      .filter((customor) => customor.isSelected)
      .map((customor) => customor.id);
    try {
      const response = await axios.put("/api/customor/update-status", {
        ids: selectedIds,
      });
      console.log("Selected data has been deleted:", response.data.message);
      await fetchData(); // 상태 업데이트 후 데이터를 새로고침합니다.
    } catch (error) {
      console.error("Error updating status:", error);
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
      <button className="delete-button" onClick={handleUpdateStatusClick}>
        선택한 데이터가 삭제되었습니다
      </button>
      <table className="customor-table">
        <thead>
          <tr>
            <th>선택</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>병원명</th>
            <th>광고 제목</th>
            <th>1차 예약 상태</th>
            <th>부재 횟수</th>
            <th>재통화 요청일</th>
            <th>예약일</th>
            <th>방문 상태</th>
            <th>배당 여부</th>
            <th>일자</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {customors.map((customor, index) => (
            <tr key={customor.id}>
              <td>
                <input
                  type="checkbox"
                  checked={customor.isSelected}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>{customor.name}</td>
              <td>{customor.phone}</td>
              <td>
                {customor.url_code_setting
                  ? customor.url_code_setting.hospital_name
                  : ""}
              </td>
              <td>
                {customor.url_code_setting
                  ? customor.url_code_setting.ad_title
                  : ""}
              </td>
              <td>
                <input
                  type="text"
                  name="initial_status"
                  value={customor.initial_status || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  disabled={!editState[customor.id]}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="no_answer_count"
                  value={customor.no_answer_count || 0}
                  onChange={(e) => handleInputChange(e, index)}
                  disabled={!editState[customor.id]}
                />
              </td>
              <td>
                {customor.recall_request_at
                  ? customor.recall_request_at.split("T")[0]
                  : ""}
              </td>
              <td>
                {customor.reservation_date
                  ? customor.reservation_date.split("T")[0]
                  : ""}
              </td>
              <td>
                <input
                  type="text"
                  name="visit_status"
                  value={customor.visit_status || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  disabled={!editState[customor.id]}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="dividend_status"
                  value={customor.dividend_status || ""}
                  onChange={(e) => handleInputChange(e, index)}
                  disabled={!editState[customor.id]}
                />
              </td>
              <td>{customor.date ? customor.date.split("T")[0] : ""}</td>
              <td>
                {editState[customor.id] ? (
                  <button
                    className="submit-button"
                    onClick={() => handleSubmit(index)}
                  >
                    저장하기
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(customor.id)}
                  >
                    수정하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
        }

        h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        .delete-button {
          padding: 10px 20px;
          background-color: #ff4757;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .delete-button:hover {
          background-color: #ff6b81;
        }

        .customor-table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align left;
        }

        th {
          background-color: #eee;
        }

        input[disabled] {
          background-color: #f9f9f9;
          color: #666;
        }

        .submit-button, .edit-button {
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .submit-button:hover, .edit-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default CodePage;
