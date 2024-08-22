import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomorDataPage({ title, get_status, put_status }) {
  const [customors, setCustomors] = useState([]);
  const [editState, setEditState] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/customor?data_status=${get_status}`
      );
      if (response.data.length > 0) {
        setCustomors(
          response.data.map((customor) => ({
            ...customor,
            isSelected: false,
          }))
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

  const handlePermanentDelete = async () => {
    const selectedIds = customors
      .filter((customor) => customor.isSelected)
      .map((customor) => customor.id);
    if (selectedIds.length > 0) {
      try {
        const response = await axios.delete(`/api/customor/delete`, {
          data: { ids: selectedIds },
        });
        console.log("Permanent delete successful:", response.data);
        alert("선택한 데이터가 영구적으로 삭제되었습니다.");
        await fetchData(); // 삭제 후 데이터 새로고침
      } catch (error) {
        console.error("Error during permanent deletion:", error);
        alert("영구 삭제 중 오류가 발생했습니다.");
      }
    } else {
      alert("삭제할 데이터를 선택하세요.");
    }
  };
  const handleUpdateStatus = async () => {
    const selectedIds = customors
      .filter((customor) => customor.isSelected)
      .map((customor) => customor.id);
    if (selectedIds.length > 0) {
      try {
        const response = await axios.put(`/api/customor/update-status`, {
          ids: selectedIds,
          data_status: put_status,
        });
        console.log("Status updated successfully:", response.data);
        alert("선택한 데이터가 삭제되었습니다.");
        await fetchData(); // 상태 업데이트 후 데이터 새로고침
      } catch (error) {
        console.error("Error updating status:", error);
        alert("선택한 데이터가 삭제 중 오류가 발생했습니다.");
      }
    } else {
      alert("삭제할 데이터를 선택하세요.");
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
      <h2>{title}</h2>

      <button onClick={handleUpdateStatus} className="delete-button">
        {get_status === 1 ? "복원" : "삭제"}
      </button>
      {get_status === 1 && (
        <button
          onClick={() => handlePermanentDelete()}
          className="permanent-delete"
        >
          영구삭제
        </button>
      )}
      <table className="customor-table">
        <thead>
          <tr>
            <th>선택</th>
            <th>No</th>
            <th>배당 여부</th>
            <th>병원명</th>
            <th>매체</th>
            <th>광고 제목</th>
            <th>이벤트명</th>
            <th>이름</th>
            <th>전화번호</th>
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
              <td>{customor.id}</td>
              <td>{customor.dividend_status}</td>
              <td>{customor.url_code_setting?.hospital_name}</td>
              <td>{customor.url_code_setting?.advertising_company}</td>
              <td>{customor.url_code_setting?.ad_title}</td>
              <td>{customor.url_code}</td>{" "}
              {/* Assuming '이벤트명' is the URL code */}
              <td>{customor.name}</td>
              <td>{customor.phone}</td>
              <td>
                {customor.created_at ? customor.created_at.split("T")[0] : ""}
              </td>
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
          margin-bottom: 10px;
          padding: 10px 15px;
          background-color: #dc3545;
          color: white;
          border: none;
          cursor: pointer;
        }
        
        .delete-button:hover {
          background-color: #c82333;
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

export default CustomorDataPage;
