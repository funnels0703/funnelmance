import React, { useEffect, useState } from "react";
import axios from "axios";
import "./customordata.scss";

function TrashcanPage() {
  const [deletedCustomors, setDeletedCustomors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/customor`);
        if (response.data.length > 0) {
          const filteredData = response.data.filter(
            (item) => item.data_status === 1
          );
          setDeletedCustomors(filteredData);
        } else {
          setError("삭제된 데이터가 없습니다.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="TrashContainer">
      <h2>삭제된 고객 데이터</h2>
      <p style={{ color: "red", fontWeight: "bold" }}>데이터 수정 중</p>
      <table className="customor-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>병원명</th>
            <th>광고 제목</th>
            <th>매체</th>
            <th>발급코드</th>
            <th>1차 예약 상태</th>
            <th>부재 횟수</th>
            <th>재통화 요청일</th>
            <th>예약일</th>
            <th>방문 상태</th>
            <th>배당 여부</th>
            <th>일자</th>
            <th>생성 일자</th>
          </tr>
        </thead>
        <tbody>
          {deletedCustomors.map((customor) => (
            <tr key={customor.id}>
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
                {customor.url_code_setting
                  ? customor.url_code_setting.advertising_company
                  : ""}
              </td>
              <td>{customor.url_code || ""}</td>
              <td>{customor.initial_status || ""}</td>
              <td>{customor.no_answer_count || 0}</td>
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
              <td>{customor.visit_status || ""}</td>
              <td>{customor.dividend_status || ""}</td>
              <td>{customor.date ? customor.date.split("T")[0] : ""}</td>
              <td>
                {customor.created_at ? customor.created_at.split("T")[0] : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrashcanPage;
