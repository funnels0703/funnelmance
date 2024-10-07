import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import CustomDropdown from "../admin/listsetting/CustomDropdown";

const CodeGenerator = () => {
  const [codes, setCodes] = useState([]);
  const [formData, setFormData] = useState({
    ad_title: "",
    ad_number: "",
    hospital_name: "",
    event_name: "",
    advertising_company: "",
    url_code: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [editingCodeId, setEditingCodeId] = useState(null);
  const [hospitals, setHospitals] = useState([]); // 병원 목록 상태
  const [events, setEvents] = useState([]); // 이벤트 목록 상태
  const [companies, setCompanies] = useState([]); // 매체 목록 상태
  const [selectedRows, setSelectedRows] = useState([]); // 선택된 행 상태
  const itemsPerPage = 10; // 한 페이지에 표시할 항목 수
  //페이지네이션
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // 병원, 이벤트, 매체 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalRes, eventRes, companyRes] = await Promise.all([
          axios.get("/api/list/hospitals"),
          axios.get("/api/list/events"),
          axios.get("/api/list/advertising_companies"),
        ]);

        // API로 받은 데이터를 드롭다운의 options 형식으로 변환
        const hospitalOptions = hospitalRes.data.items.map((hospital) => ({
          value: hospital.id,
          label: hospital.name,
        }));
        const eventOptions = eventRes.data.items.map((event) => ({
          value: event.id,
          label: event.name,
        }));
        const companyOptions = companyRes.data.items.map((company) => ({
          value: company.id,
          label: company.name,
        }));

        // 상태 업데이트
        setHospitals(hospitalOptions);
        setEvents(eventOptions);
        setCompanies(companyOptions);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

  // Validate form
  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [formData]);

  // 코드 데이터 가져오기
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/api/urlCode/list?page=${currentPage}&limit=${itemsPerPage}`
      );
      setCodes(response.data.codesWithDetails);
      setTotalPages(response.data.totalPages); // 서버에서 받은 전체 페이지 수
      setCurrentPage(response.data.currentPage); // 서버에서 받은 현재 페이지
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
      alert("데이터를 불러오는데 실패했습니다.");
      setCodes([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  // Data submit handler
  const handleSubmit = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    const dataToSubmit = { ...formData, url_code: result };

    try {
      const response = await axios.post("/api/urlcode", dataToSubmit);
      alert("코드 생성했습니다");
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.status === 400) {
        alert("중복된 코드입니다. 다시 생성해 주세요.");
      } else {
        alert("데이터 전송 중 오류가 발생했습니다.");
      }
    }
  };

  // 유저 수정 버튼 핸들러
  const handleEdit = (id) => {
    setEditingCodeId(id);
  };

  // 유저 수정 저장 핸들러
  const handleSave = async (user) => {
    try {
      await axios.put(`/api/user/update`, user);
      setEditingCodeId(null); // 수정 모드 종료
    } catch (error) {
      console.error("유저 정보 수정 중 오류가 발생했습니다:", error);
      alert("유저 정보 수정에 실패했습니다.");
    }
  };

  // 개별 유저 필드 수정 핸들러
  const handleCodeChange = (id, field, value) => {
    setCodes((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === id ? { ...user, [field]: value } : user
      )
    );
  };
  // ----------------------------------- 페이지 네이션
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); // 페이지 변경
    }
  };
  return (
    <div className="code-generator container">
      <TitleBox mainmenu="코드 생성" />
      <div className="code_form">
        <div className="input-group">
          <label>랜딩 제목</label>
          <input
            type="text"
            name="ad_title"
            value={formData.ad_title}
            onChange={handleChange}
            placeholder="광고 제목"
            required
          />
        </div>
        <div className="input-group">
          <label>랜딩 번호</label>
          <input
            type="text"
            name="ad_number"
            value={formData.ad_number}
            onChange={handleChange}
            placeholder="광고 번호"
            required
          />
        </div>
        <div className="input-group">
          <label>병원</label>
          <div style={{ width: "217px", height: "40px" }}>
            <CustomDropdown
              options={hospitals} // 병원 목록 전달
              selectedValue={formData.hospital_name}
              onChange={(value) => handleDropdownChange("hospital_name", value)} // 선택된 값 업데이트
              bigDrop={1}
              search={1}
            />{" "}
          </div>
        </div>
        <div className="input-group">
          <label>이벤트명</label>
          <div style={{ width: "217px", height: "40px" }}>
            <CustomDropdown
              options={events} // 이벤트 목록 전달
              selectedValue={formData.event_name}
              onChange={(value) => handleDropdownChange("event_name", value)} // 선택된 값 업데이트
              bigDrop={1}
              search={1}
            />{" "}
          </div>
        </div>
        <div className="input-group">
          <label>매체</label>
          <div style={{ width: "217px", height: "40px" }}>
            <CustomDropdown
              options={companies} // 매체 목록 전달
              selectedValue={formData.advertising_company}
              onChange={(value) =>
                handleDropdownChange("advertising_company", value)
              } // 선택된 값 업데이트
              bigDrop={1}
              search={1}
            />
          </div>
        </div>
        <button type="button" onClick={handleSubmit} disabled={!isFormValid}>
          코드 생성하기
        </button>
      </div>

      {/* 코드 테이블 */}
      <h2>코드 리스트</h2>
      <button>삭제</button>
      <table className="code-table">
        <thead>
          <tr>
            <th style={{ width: "8%" }}>선택</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>랜딩코드</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>랜딩번호</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>병원명</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>랜딩제목</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>매체</th>
            <th style={{ width: "calc((100% - 8% * 2) / 6)" }}>이벤트명</th>
            <th style={{ width: "8%" }}>수정</th>
          </tr>
        </thead>
        <tbody>
          {codes &&
            codes.map((code) => (
              <tr
                key={code.id}
                className={selectedRows.includes(code.id) ? "selected" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(code.id)}
                    onChange={() => handleCheckboxChange(code.id)}
                  />
                </td>
                <td>{code.url_code}</td>
                <td>
                  <input
                    type="text"
                    value={code.ad_number}
                    disabled={editingCodeId !== code.user_id} // 수정 모드일 때만 활성화
                    onChange={(e) =>
                      handleCodeChange(
                        code.user_id,
                        "ad_number",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={code.hospital_name}
                    disabled={editingCodeId !== code.id} // 수정 모드일 때만 활성화
                    onChange={(e) =>
                      handleCodeChange(code.id, "hospital_name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={code.ad_title}
                    disabled={editingCodeId !== code.id} // 수정 모드일 때만 활성화
                    onChange={(e) =>
                      handleCodeChange(code.id, "ad_title", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={code.advertising_company}
                    disabled={editingCodeId !== code.id} // 수정 모드일 때만 활성화
                    onChange={(e) =>
                      handleCodeChange(
                        code.id,
                        "advertising_company",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={code.event_name}
                    disabled={editingCodeId !== code.id} // 수정 모드일 때만 활성화
                    onChange={(e) =>
                      handleCodeChange(code.id, "event_name", e.target.value)
                    }
                  />
                </td>
                <td>
                  {editingCodeId === code.id ? (
                    <button onClick={() => handleSave(code)}>저장</button>
                  ) : (
                    <button onClick={() => handleEdit(code.id)}>수정</button>
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
      <style jsx>{`
        .code-generator {
          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          .code_form {
            display: flex;
            justify-content: space-between;
            gap: 21px;
            .input-group {
              label {
                display: block;
                margin-bottom: 5px;
                color: #555;
              }
              input {
                width: 100%;
                padding: 10px;
                font-size: 16px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
            }
            button {
              width: 240px;
              height: 50px;
              color: white;
              border-radius: 5px;
              background: #4880ff;
              cursor: pointer;
            }
            button[type="button"] {
              background-color: #555;
            }
            button:disabled {
              background-color: #999;
              cursor: not-allowed;
              border: none;
            }
            button:hover:enabled {
              background-color: #005bb5;
            }
             {
              /* .url-code {
              display: flex;
              align-items: center;
            }
            .url-code input {
              flex: 1;
              margin-right: 10px;
            } */
            }
          }
        }
      `}</style>
    </div>
  );
};

export default CodeGenerator;
