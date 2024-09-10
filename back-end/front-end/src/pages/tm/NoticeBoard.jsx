import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  const navigate = useNavigate();

  // 전체 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`/api/tm/notices`);
        const data = response.data;
        // 서버 응답 구조를 확인하고 데이터가 정의되어 있는지 확인
        if (data && data.notices) {
          setNotices(data.notices);
        } else {
          console.error("Unexpected response format:", data);
          setNotices([]);
        }
      } catch (error) {
        console.error(
          "Error fetching notices:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchNotices();
  }, []);

  // 공지사항 클릭 시 상세 페이지로 이동
  const handleRowClick = (id) => {
    navigate(`/tm/notices/${id}`);
  };

  // 새로운 공지사항 생성 페이지로 이동
  const handleCreateNewClick = () => {
    navigate("/tm/notices/new");
  };

  return (
    <div>
      <h1>공지사항</h1>
      <button onClick={handleCreateNewClick}>Create New Notice</button>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Type</th>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <tr key={notice.id} onClick={() => handleRowClick(notice.id)}>
                <td>{index + 1}</td> {/* 전체 공지사항에서의 순서 번호 */}
                <td>{notice.type}</td>
                <td>{notice.title}</td>
                <td>{notice.user.username}</td> {/* 작성자 이름 */}
                <td>{new Date(notice.createdAt).toLocaleDateString()}</td>{" "}
                {/* 날짜 포맷팅 */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No notices available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeBoard;
