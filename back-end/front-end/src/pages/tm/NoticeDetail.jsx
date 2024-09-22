import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NoticeDetail = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState({
    title: "",
    content:
      "중앙선거관리위원회는 법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며, 법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다. 국가유공자·상이군경 및 전몰군경의 유가족은 법률이 정하는 바에 의하여 우선적으로 근로의 기회를 부여받는다. 군사법원의 조직·권한 및 재판관의 자격은 법률로 정한다. 신체장애자 및 질병·노령 기타의 사유로 생활능력이 없는 국민은 법률이 정하는 바에 의하여 국가의 보호를 받는다. 모든 국민은 거주·이전의 자유를 가진다. 법원은 최고법원인 대법원과 각급법원으로 조직된다. 대통령은 내우·외환·천재·지변 또는 중대한 재정·경제상의 위기에 있어서 국가의 안전보장 또는 공공의 안녕질서를 유지하기 위하여 긴급한 조치가 필요하고 국회의 집회를 기다릴 여유가 없을 때에 한하여 최소한으로 필요한 재정·경제상의 처분을 하거나 이에 관하여 법률의 효력을 가지는 명령을 발할 수 있다.탄핵결정은 공직으로부터 파면함에 그친다. 그러나, 이에 의하여 민사상이나 형사상의 책임이 면제되지는 아니한다. 각급 선거관리위원회는 선거인명부의 작성등 선거사무와 국민투표사무에 관하여 관계 행정기관에 필요한 지시를 할 수 있다. 사면·감형 및 복권에 관한 사항은 법률로 정한다. 국민경제자문회의의 조직·직무범위 기타 필요한 사항은 법률로 정한다. 중앙선거관리위원회는 대통령이 임명하는 3인, 국회에서 선출하는 3인과 대법원장이 지명하는 3인의 위원으로 구성한다. 위원장은 위원중에서 호선한다. 법률은 특별한 규정이 없는 한 공포한 날로부터 20일을 경과함으로써 효력을 발생한다.",
    type: "GENERAL",
    user: {
      username: "",
    },
  });
  const [isEditing, setIsEditing] = useState(!id); // id가 없으면 새로운 공지 작성 모드로 설정
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
    const method = id ? "put" : "post"; // id가 있으면 수정, 없으면 새로 생성
    const url = id ? `/api/tm/notices/${id}` : "/api/tm/notices/new";

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
        console.log(
          id ? "수정이 완료되었습니다." : "새 공지가 작성되었습니다."
        );
        navigate("/tm/notices");
      } else {
        console.error("Error saving notice:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving notice:", error);
    }
  };

  const handleDeleteClick = async () => {
    if (!id) return;

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
    <div className="notice_detail_container">
      <div className="detail_head">
        <input
          className="detail_title"
          type="text"
          name="title"
          value={notice.title}
          onChange={handleChange}
          disabled={!isEditing} // 수정 모드일 때만 활성화
          required
          placeholder="제목을 입력하세요"
        />

        <div className="detail_type">
          <label>종류</label>
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

        {!isEditing && (
          <div className="disabled">
            <div>
              <label>작성일ㆍ</label>
              <input type="date" value={notice.created_at} disabled />
            </div>
            <div>
              <label>마지막 수정일ㆍ</label>
              <input type="date" value={notice.updated_at} disabled />
            </div>
            <div>
              <label>작성자ㆍ</label>
              <input type="text" value={notice.user.username} disabled />
            </div>
          </div>
        )}
      </div>

      <textarea
        className="detail_content"
        name="content"
        value={notice.content}
        onChange={handleChange}
        disabled={!isEditing} // 수정 모드일 때만 활성화
        required
        placeholder="내용을 입력하세요"
      />

      {isEditing ? (
        <>
          <button onClick={handleSaveClick}>{id ? "저장" : "작성완료"}</button>
          {id && <button onClick={handleDeleteClick}>Delete Notice</button>}
          {id && <button onClick={() => setIsEditing(false)}>Cancel</button>}
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>수정하기</button>
      )}
      <style jsx>
        {`
          .notice_detail_container {
            width: 100%;
            height: 100%;
            input[type="text"],
            textarea {
              &:focus {
                border: none;
                outline: none;
                color: #555;
              }
            }
            .detail_head {
              border-bottom: 1px solid #ccc;
              height: 130px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              .detail_title {
                font-size: 24px;
                border: none;
                font-weight: 600;
                border: none;
                width: 100%;
              }
              .detail_type {
                font-size: 16px;
                label {
                  margin-right: 5px;
                  color: #555;
                }
                select {
                  padding: 5px 10px;
                  cursor: pointer;
                  border-radius: 5px;
                }
              }
              .disabled {
                display: flex;
                align-items: center;
                color: #a0a4a8;
                font-size: 14px;

                input {
                  border: none;
                  color: #a0a4a8;
                }
              }
            }

            .detail_content {
              width: 100%;
              height: calc(100% - 120px);
              padding: 20px 10px;
              border: none;
              font-size: 15px;
              line-height: 20px;
              color: #555;
              overflow-y: scroll;
              overflow-x: hidden;
            }

            button {
              border-radius: 5px;
              background: #4880ff;
              color: #fff;
              border: none;
              font-size: 16px;
              font-weight: 600;
              padding: 5px 10px;
              position: fixed;
              right: 100px;
              bottom: 100px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NoticeDetail;
