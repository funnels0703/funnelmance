import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../../components/TitleBox";
import CustomDropdown from "./CustomDropdown";
import DeleteBox from "./DeleteBox"; // DeleteBox 컴포넌트 임포트
import "./listsetting.scss";

function TabComponent() {
  const [activeTab, setActiveTab] = useState("hospitals");
  const [name, setName] = useState("");
  const [hospital_code, setHospital_code] = useState("");
  const [data, setData] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 항목을 저장하는 상태 추가
  const [showDeleteBox, setShowDeleteBox] = useState(false); // 모달 표시 여부

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const itemsPerPage = 10; // 한 페이지에 표시할 항목 수

  useEffect(() => {
    fetchData(); // 페이지나 탭이 변경될 때 데이터를 다시 불러옴
  }, [activeTab, currentPage]); // activeTab과 currentPage를 의존성 배열에 추가

  const fetchData = async () => {
    const urls = {
      hospitals: "/api/list/hospitals",
      events: "/api/list/events",
      advertising_companies: "/api/list/advertising_companies",
    };
    try {
      const response = await axios.get(
        `${urls[activeTab]}?page=${currentPage}&limit=${itemsPerPage}`
      );

      // status 값에 따라 "진행 중", "종료"로 변환
      const transformedData = response.data.items.map((item) => ({
        ...item,
        status:
          item.status === 1
            ? "진행 중"
            : item.status === 2
            ? "종료"
            : "알 수 없음", // 추가적인 상태에 대한 기본 처리
        edit: false,
      }));

      setData(transformedData);
      setTotalPages(response.data.totalPages); // 서버에서 받은 전체 페이지 수
      setCurrentPage(response.data.currentPage); // 서버에서 받은 현재 페이지
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
    setCurrentPage(1);
    fetchData();
  };

  const handleAdd = async () => {
    const url = "/api/list/" + activeTab;
    const payload =
      activeTab === "hospitals" ? { name, hospital_code } : { name };
    try {
      const response = await axios.post(url, payload);

      setName("");
      setHospital_code("");
      fetchData();
    } catch (error) {
      if (error.response && error.response.status === 405) {
        // 병원 코드 중복 에러 처리
        alert("이미 존재하는 병원 코드입니다.");
      } else {
        console.error("데이터 추가 오류:", error);
        alert("데이터 추가에 실패했습니다.");
      }
    }
  };

  const handleEdit = (id) => {
    setEditableId(id);
  };

  const handleUpdate = async (id) => {
    const item = data.find((item) => item.id === id);
    if (!item) return;

    const url = `/api/list/${activeTab}/${id}`;

    // 병원 코드와 담당자 정보를 포함하여 PUT 요청을 보냄
    const payload = {
      name: item.name,
      status: item.status,
      hospital_code: item.hospital_code, // 병원 코드 추가
      manager: item.manager, // 담당자 추가
    };

    try {
      await axios.put(url, payload);
      fetchData();
      setEditableId(null);
    } catch (error) {
      console.error("데이터 업데이트 오류:", error);
      alert("데이터 업데이트에 실패했습니다.");
    }
  };

  // 선택 처리 핸들러
  const handleSelect = (id) => {
    setSelectedIds(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((selectedId) => selectedId !== id) // 이미 선택된 경우 제거
          : [...prevSelected, id] // 선택되지 않은 경우 추가
    );
  };

  // 삭제기능

  // 삭제 버튼 클릭 시 모달을 띄우는 함수
  const handleDeleteClick = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    setShowDeleteBox(true); // 모달을 띄움
  };

  // 모달에서 확인 눌렀을 때 삭제 처리
  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => axios.delete(`/api/list/${activeTab}/${id}`))
      );
      // alert('선택한 항목이 성공적으로 삭제되었습니다.');
      fetchData(); // 데이터 새로고침
      setSelectedIds([]); // 선택된 항목 초기화
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제하는 동안 오류가 발생했습니다.");
    } finally {
      setShowDeleteBox(false); // 모달 닫기
    }
  };

  // 모달에서 취소 버튼을 눌렀을 때 모달 닫기
  const handleCancelDelete = () => {
    setShowDeleteBox(false); // 모달 닫기
  };
  // ----------------------------------- 페이지 네이션
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // 페이지 변경
    }
  };
  const deleteMessage = `현재 선택한 ${
    activeTab === "hospitals"
      ? "병원을"
      : activeTab === "events"
      ? "이벤트를"
      : "매체를"
  } 정말 삭제하시겠습니까?`;

  const handleStatusChange = (id, newStatus) => {
    const newData = data.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setData(newData);
  };

  const statusOptions = [
    { label: "진행 중", value: 1 },
    { label: "종료", value: 2 },
  ];

  return (
    <div className="listContainer container_flex">
      <div className="TabSetting container_left">
        <TitleBox
          mainmenu="관리자페이지"
          submenu={
            activeTab === "hospitals"
              ? "병원 등록"
              : activeTab === "events"
              ? "이벤트 등록"
              : activeTab === "advertising_companies"
              ? "매체 등록"
              : ""
          }
        />
        <div className="postForm">
          <label>
            {activeTab === "hospitals" && "병원 이름"}
            {activeTab === "events" && "이벤트 이름"}
            {activeTab === "advertising_companies" && "매체 이름"}
            <input
              className={`listInput ${
                activeTab === "events"
                  ? "longInput"
                  : activeTab === "advertising_companies"
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
        <div className="listTitleHeader">
          <h2 className="listTitle">
            {activeTab === "hospitals"
              ? "병원"
              : activeTab === "events"
              ? "이벤트"
              : activeTab === "advertising_companies"
              ? "매체"
              : ""}{" "}
            리스트
          </h2>
          <button className="listDeleteBTN" onClick={handleDeleteClick}>
            삭제
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "center",
                  width: activeTab === "hospitals" ? "8%" : "4%",
                }}
              >
                선택
              </th>
              {activeTab === "hospitals" && (
                <th style={{ width: "12%" }}>병원코드</th>
              )}
              <th style={{ width: "20%" }}>병원이름</th>
              <th style={{ paddingLeft: "20px", width: "18%" }}>진행/종료</th>
              {activeTab === "hospitals" && (
                <th style={{ width: "20%" }}>담당자</th>
              )}
              <th
                style={{
                  width: activeTab === "hospitals" ? "8%" : "4%",
                }}
              >
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className={selectedIds.includes(item.id) ? "selected" : ""}
              >
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)} // 체크박스에서 선택 처리
                  />
                </td>
                {activeTab === "hospitals" && (
                  <td
                    className={`${
                      item.status === "종료" ? "editInputColor" : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={item.hospital_code || ""}
                      onChange={(e) => {
                        const newData = data.map((x) =>
                          x.id === item.id
                            ? { ...x, hospital_code: e.target.value }
                            : x
                        );
                        setData(newData); // 상태를 업데이트하여 value가 변하도록 설정
                      }}
                      disabled={editableId !== item.id}
                      className={`${
                        editableId === item.id ? "editInputColor" : ""
                      }`}
                    />
                  </td>
                )}

                <td
                  className={`${
                    item.status === "종료" ? "editInputColor" : ""
                  }`}
                >
                  {item.name}
                </td>
                <td
                  className={`${
                    item.status === "종료" ? "editInputColor" : ""
                  }`}
                >
                  {editableId === item.id ? (
                    <CustomDropdown
                      selectedValue={item.status}
                      options={statusOptions}
                      onChange={(newStatus) =>
                        handleStatusChange(item.id, newStatus)
                      }
                    />
                  ) : (
                    <span className="normalSpan">{item.status}</span>
                  )}
                </td>

                {activeTab === "hospitals" && (
                  <td
                    className={`${
                      item.status === "종료" ? "editInputColor" : ""
                    }`}
                  >
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
                      disabled={editableId !== item.id} // 담당자 필드는 수정 가능
                      className={`${
                        editableId === item.id ? "editInputColor" : ""
                      }`}
                    />
                  </td>
                )}
                <td
                  className={`${
                    item.status === "종료" ? "editInputColor" : ""
                  }`}
                >
                  {editableId === item.id ? (
                    <button
                      className="listSaveBTN"
                      onClick={() => handleUpdate(item.id)}
                    >
                      저장
                    </button>
                  ) : (
                    <button
                      className={`${
                        item.status === "종료"
                          ? "listSaveBTN editInputColor"
                          : "listSaveBTN"
                      }`}
                      onClick={() => handleEdit(item.id)}
                    >
                      수정
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <div className="pagination">
          <button onClick={() => handlePageChange(1)}>
            <img
              src={process.env.PUBLIC_URL + "/images/page/start.png"}
              className="doubleArrow"
              alt="첫 페이지"
            />
          </button>
          {/* 이전 페이지 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <img
              src={process.env.PUBLIC_URL + "/images/page/before.png"}
              className="singleArrow"
              alt="이전 페이지"
            />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .slice(
              (Math.ceil(currentPage / 10) - 1) * 10,
              Math.ceil(currentPage / 10) * 10
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? "currentPage" : ""}
              >
                {page}
              </button>
            ))}
          <button onClick={() => handlePageChange(currentPage + 10)}>
            {"..."}
          </button>{" "}
          {/* 다음 페이지 묶음 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <img
              src={process.env.PUBLIC_URL + "/images/page/end.png"}
              className="singleArrow"
              alt="다음 페이지"
            />
          </button>
          {/* 마지막 페이지 */}
          <button onClick={() => handlePageChange(totalPages)}>
            <img
              src={process.env.PUBLIC_URL + "/images/page/next.png"}
              className="doubleArrow"
              alt="마지막 페이지"
            />
          </button>
        </div>
        {showDeleteBox && (
          <DeleteBox
            message={deleteMessage}
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
          />
        )}
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
            activeTab === "advertising_companies" ? "active" : ""
          }`}
          onClick={() => handleTabChange("advertising_companies")}
        >
          매체 등록
        </button>
      </div>
    </div>
  );
}

export default TabComponent;
