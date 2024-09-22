import React, { useState, useEffect } from "react";
import axios from "axios";

function TabComponent() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [name, setName] = useState("");
  const [hospital_code, setHospital_code] = useState(""); // 담당자 이름 상태 추가
  const [data, setData] = useState([]);
  const [editableId, setEditableId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    const urls = {
      hospitals: "/api/list/hospitals",
      events: "/api/list/events",
      advertising_company: "/api/list/advertising_companies",
    };
    try {
      const response = await axios.get(urls[activeTab]);
      setData(response.data.map((item) => ({ ...item, edit: false })));
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
      alert("데이터를 불러오는데 실패했습니다.");
      setData([]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setName("");
    setHospital_code("");
  };

  const handleAdd = async () => {
    const url = "/api/list/" + activeTab;
    const payload =
      activeTab === "hospitals" ? { name, hospital_code } : { name };
    try {
      const response = await axios.post(url, payload);
      console.log("데이터가 성공적으로 추가되었습니다:", response.data);
      alert("데이터가 성공적으로 추가되었습니다.");
      setData((prev) => [
        ...prev,
        { ...response.data, id: prev.length + 1000, edit: false },
      ]);
      setName("");
      setHospital_code("");
    } catch (error) {
      console.error("데이터 추가 오류:", error);
      alert("데이터 추가에 실패했습니다.");
    }
  };

  const handleEdit = (id) => {
    setEditableId(id);
  };

  const handleUpdate = async (id) => {
    const item = data.find((item) => item.id === id);
    if (!item) return;
    const url = `/api/list/${activeTab}/${id}`;
    try {
      await axios.put(url, { name: item.name, status: item.status });
      alert("데이터가 성공적으로 업데이트되었습니다.");
      setEditableId(null);
    } catch (error) {
      console.error("데이터 업데이트 오류:", error);
      alert("데이터 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="listContainer">
      <div className="TabSetting">
        <div className="listHeader">
          <div className="listHeaderTitle">
            <div>관리자페이지</div>
            <div>
              {activeTab === "hospitals" && "병원 "}
              {activeTab === "events" && "이벤트 "}
              {activeTab === "advertising_company" && "매체 "}등록
            </div>
          </div>

          <div className="listLine"></div>
        </div>
        <div className="postForm">
          <label>
            {activeTab === "hospitals" && "병원 이름"}
            {activeTab === "events" && "이벤트 이름"}
            {activeTab === "advertising_company" && "매체 이름"}
            <input
              className={`listInput ${
                activeTab === "events"
                  ? "longInput"
                  : activeTab === "advertising_company"
                  ? "longInput2"
                  : ""
              }`}
              type="text"
              placeholder={
                activeTab === "hospitals"
                  ? "병원 이름을 입력하세요."
                  : activeTab === "events"
                  ? "이벤트 이름을 입력하세요."
                  : "매체 이름을 입력하세요."
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {activeTab === "hospitals" && (
            <label>
              병원 코드
              <input
                className="listInput"
                type="text"
                placeholder="할당 번호를 입력하세요"
                value={hospital_code}
                onChange={(e) => setHospital_code(e.target.value)}
              />
            </label>
          )}
        </div>
        {/* post 버튼  */}
        <button className="listPostBtn" onClick={handleAdd}>
          {activeTab === "hospitals"
            ? "병원 등록하기"
            : activeTab === "events"
            ? "이벤트 등록하기"
            : "매체 등록하기"}
        </button>
        <table className="data-table">
          <thead>
            <tr>
              <th>선택</th>
              {activeTab === "hospitals" && <th>병원코드</th>}
              <th>병원이름</th>
              <th>진행/종료</th>
              {activeTab === "hospitals" && <th>담당자</th>}
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input type="checkbox" />
                </td>
                {activeTab === "hospitals" && (
                  <td>{item.hospital_code || "코드 없음"}</td>
                )}
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newData = data.map((x) =>
                        x.id === item.id ? { ...x, name: e.target.value } : x
                      );
                      setData(newData);
                    }}
                    disabled={editableId !== item.id}
                  />
                </td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) => {
                      const newData = data.map((x) =>
                        x.id === item.id ? { ...x, status: e.target.value } : x
                      );
                      setData(newData);
                    }}
                    disabled={editableId !== item.id}
                  >
                    <option value="진행 중">진행 중</option>
                    <option value="종료">종료</option>
                  </select>
                </td>
                {activeTab === "hospitals" && (
                  <td>
                    <input
                      type="text"
                      value={item.manager || ""}
                      onChange={(e) => {
                        const newData = data.map((x) =>
                          x.id === item.id
                            ? { ...x, manager: e.target.value }
                            : x
                        );
                        setData(newData);
                      }}
                      disabled={editableId !== item.id}
                    />
                  </td>
                )}

                <td>
                  {editableId === item.id ? (
                    <button onClick={() => handleUpdate(item.id)}>저장</button>
                  ) : (
                    <button onClick={() => handleEdit(item.id)}>수정</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "hospitals" ? "active" : ""}`}
          onClick={() => handleTabChange("hospitals")}
        >
          병원 등록
        </button>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => handleTabChange("events")}
        >
          이벤트 등록
        </button>
        <button
          className={`tab ${
            activeTab === "advertising_company" ? "active" : ""
          }`}
          onClick={() => handleTabChange("advertising_company")}
        >
          매체 등록
        </button>
      </div>
      <style jsx>{`
        .listContainer {
          background-color: #f5f6fa;
          display: flex;
          flex-direction: row;
          .listHeader {
            display: flex;
            flex-direction: column;
            width: 940px;
            .listHeaderTitle {
              display: flex;
              justify-content: space-between;
              color: #979797;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
            .listLine {
              width: 940px;
              margin: 16px 0;
              height: 2px;
              background: #efefef;
            }
          }
        }
        .TabSetting {
          background-color: #ffffff;
          padding: 47px 70px;
          border-radius: 8px;
          align-items: center;
          display: flex;
          flex-direction: column;
        }
        .tabs {
          display: flex;
          flex-direction: column;
          height: 204px;
          margin-left: 27px;
        }

        .tab {
          width: 20.8vw;
          height: 60px;
          flex-grow: 1;
          margin-bottom: 12px;
          cursor: pointer;
          color: white;
          background-color: #ffffff;
          color: #003181;
          font-size: 16px;
          font-weight: 500;
          border: 1px solid #003181;
          border-radius: 8px;
        }

        .tab.active {
          background-color: #003181;
          color: #ffffff;
        }

        .postForm {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 61px 0 25px;
          width: 940px;
          justify-content: space-between;
          label {
            color: #343434;
            font-size: 16px;
            font-weight: 500;
            height: 50px;
            line-height: 50px;
          }
        }
        .listInput {
          margin-left: 14px;
          width: 19.791vw;
          height: 50px;
          border-radius: 10px;
          border: 1px solid #d9d9d9;
          background: var(--White, #fff);
          outline: none;
          padding: 0 21px;
          font-size: 16px;
          line-height: 50px;
        }
        .longInput {
          width: 44.41vw;
        }
        .longInput2 {
          width: 45.13vw;
        }
        .listPostBtn {
          width: 240px;
          height: 50px;
          margin: 0 auto;
          align-items: center;
          background-color: #4880ff;
          color: white;
          text-align: center;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          border: none;
          border-radius: 5px;
        }
         {
          /* ------------------------------------------------- */
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .data-table th,
        .data-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
          font-size: 14px;
        }
        .data-table th {
          background-color: #f1f1f1;
          font-weight: 600;
        }
        .data-table td {
          background-color: #fafafa;
          transition: background-color 0.3s;
        }
        .data-table td:hover {
          background-color: #f5f5f5;
        }
        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }
          .tab {
            margin-bottom: 10px;
          }
          .postForm {
            width: 100%;
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default TabComponent;
