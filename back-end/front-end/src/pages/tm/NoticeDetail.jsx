import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState({
    title: "",
    content: "",
    type: "NOTICE",
    user: {
      username: "",
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchNoticeDetail = async () => {
        try {
          const response = await axios.get(`/api/tm/notices/${id}`);
          setNotice(response.data);
        } catch (error) {
          console.error("Error fetching notice detail:", error);
        }
      };

      fetchNoticeDetail();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice((prevNotice) => ({
      ...prevNotice,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const method = isEditing ? "put" : "post";
    const url = isEditing ? `/api/tm/notices/${id}` : "/api/tm/notices/new";

    try {
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: notice,
      });

      if (response.status === 200 || response.status === 201) {
        console.log("수정이 완료되었습니다.");
        navigate("/tm/notices");
      } else {
        console.error("Error saving notice:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving notice:", error);
    }
  };

  const handleDeleteClick = async () => {
    if (!isEditing) return;

    try {
      const response = await axios.delete(`/api/tm/notices/${id}`);

      if (response.status === 200 || response.status === 204) {
        console.log("삭제가 완료되었습니다.");
        navigate("/tm/notices");
      } else {
        console.error("Error deleting notice:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  return (
    <div>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={notice.title}
          onChange={handleChange}
          disabled={!isEditing} // 수정 모드일 때만 활성화
          required
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          name="content"
          value={notice.content}
          onChange={handleChange}
          disabled={!isEditing} // 수정 모드일 때만 활성화
          required
        />
      </div>
      <div>
        <label>Type:</label>
        <select
          name="type"
          value={notice.type}
          onChange={handleChange}
          disabled={!isEditing} // 수정 모드일 때만 활성화
        >
          <option value="NOTICE">공지</option>
          <option value="GENERAL">일반</option>
        </select>
      </div>
      <div>
        <label>Author:</label>
        <input type="text" value={notice.user.username} disabled />
      </div>
      {isEditing ? (
        <>
          <button onClick={handleSaveClick}>Save Changes</button>
          <button onClick={handleDeleteClick}>Delete Notice</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Notice</button>
      )}
    </div>
  );
};

export default NoticeDetail;
