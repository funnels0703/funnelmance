import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode"; // jwt-decode 임포트

function FilterComponent({
  filters,
  onFilterChange,
  checkedCompanies, // 체크된 매체의 id 값 (int)
  setCheckedCompanies,
  companyOptions,
  setCompanyOptions,
  // 매체 관련
  isCompanyDropdownOpen,
  setIsCompanyDropdownOpen,
  // 날짜 관련
  customDateRange,
  setCustomDateRange,
  // 병원 관련
  hospitalOptions,
  setHospitalOptions,
  selectedHospital,
  setSelectedHospital,
}) {
  const formatKoreanDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  };
  // 로컬 스토리지에서 토큰을 가져오고 userId를 추출
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 추출
    if (token) {
      const decoded = jwtDecode(token); // JWT 디코딩
      // console.log(decoded.userId);

      return decoded.userId; // userId 추출
    }

    return null;
  };
  //   const [customDateRange, setCustomDateRange] = useState({
  //     startDate: formatKoreanDate(new Date()),
  //     endDate: formatKoreanDate(new Date()),
  //   });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 병원 필터 열림/닫힘 상태

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false); // 날짜 필터 열림/닫힘 상태
  const [selectedDateOption, setSelectedDateOption] = useState("오늘");

  // const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); // 회사 필터 열림/닫힘 상태 => 프롭스로 변경
  const [companyInput, setCompanyInput] = useState(""); // 회사 필터 검색 입력값
  const [selectedCompany, setSelectedCompany] = useState(""); // 선택된 회사

  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로드 여부를 확인하는 상태

  // const [companyOptions, setCompanyOptions] = useState([]); // 회사 필터 옵션
  // const [checkedCompanies, setCheckedCompanies] = useState([]); // 체크된 회사 목록

  const handleCompanyDropdownClick = (e) => {
    e.stopPropagation(); // 상위 요소로의 이벤트 전파를 막습니다.
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (hospital) => {
    setSelectedHospital(hospital.id); // 병원의 ID를 선택된 병원으로 설정
    setIsDropdownOpen(false);
    onFilterChange({
      ...filters,
      hospital_name: hospital.name,
      selected_hospital_id: hospital.id, // 선택된 병원의 ID 값을 추가
    });
  };

  const handleDateDropdownClick = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };

  const handleDateOptionClick = (option, value) => {
    setSelectedDateOption(option);
    setIsDateDropdownOpen(false);
    updateDateRange(value);
  };

  const handleCompanyOptionClick = (e, company) => {
    e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록 막습니다.
    setSelectedCompany(company);
    setIsCompanyDropdownOpen(false);
    onFilterChange({
      ...filters,
      company_name: company,
    });
  };

  const dateOptions = [
    { label: "오늘", value: "today" },
    { label: "최근 7일", value: "last7days" },
    { label: "최근 30일", value: "last30days" },
    { label: "어제", value: "yesterday" },
    { label: "지난주 (오늘 제외)", value: "lastweek" },
  ];

  const filteredCompanyOptions = companyOptions.filter(
    (company) =>
      company &&
      typeof company.name === "string" &&
      company.name.toLowerCase().includes(companyInput.toLowerCase())
  );

  const updateDateRange = (option) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (option) {
      case "today":
        startDate = endDate = new Date();
        break;
      case "yesterday":
        startDate = endDate = new Date(today.setDate(today.getDate() - 1));
        break;
      case "last7days":
        startDate = new Date(today.setDate(today.getDate() - 6));
        endDate = new Date();
        break;
      case "last30days":
        startDate = new Date(today.setDate(today.getDate() - 29));
        endDate = new Date();
        break;
      case "lastweek":
        const lastWeekStart = new Date(
          today.setDate(today.getDate() - today.getDay() - 6)
        );
        const lastWeekEnd = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;
      default:
        startDate = endDate = new Date();
        break;
    }

    setCustomDateRange({
      startDate: formatKoreanDate(startDate),
      endDate: formatKoreanDate(endDate),
    });

    onFilterChange({
      ...filters,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  const userId = getUserIdFromToken(); // userId 추출

  // 매체 리스트 저장
  const saveSelectedCompanies = async (updatedCheckedCompanies) => {
    try {
      if (!userId) {
        console.error("유효한 사용자 ID를 찾을 수 없습니다.");
        return;
      }

      // 서버에 선택한 매체 ID 전송
      await axios.put(`/api/advertise/settings/${userId}`, {
        advertisingCompanyIds: checkedCompanies,
      });
    } catch (error) {
      console.error("매체 저장 중 오류 발생:", error);
    }
  };

  // 체크박스 클릭 핸들러 (문자열을 배열로 변환 후 처리)
  const handleCheckboxChange = (companyId) => {
    // checkedCompanies가 문자열이면 배열로 변환
    const companiesArray =
      typeof checkedCompanies === "string"
        ? checkedCompanies.split(",").map(Number) // 문자열을 숫자 배열로 변환
        : checkedCompanies;

    // 체크된 회사 목록 업데이트
    const updatedCheckedCompanies = companiesArray.includes(companyId)
      ? companiesArray.filter((id) => id !== companyId) // 이미 있으면 제거
      : [...companiesArray, companyId]; // 없으면 추가

    // 배열을 오름차순으로 정렬한 후 문자열로 변환하여 저장
    setCheckedCompanies(
      updatedCheckedCompanies.sort((a, b) => a - b).join(",")
    );
  };

  // useEffect를 사용하여 checkedCompanies가 변경될 때마다 saveSelectedCompanies 호출
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false); // 처음 로드 시에는 업데이트 방지
      return;
    }

    if (checkedCompanies) {
      saveSelectedCompanies(checkedCompanies);
    }
  }, [checkedCompanies]); // checkedCompanies가 변경될 때마다 실행

  // 매체 리스트 받기 + 광고 회사 ID 가져오기
  useEffect(() => {
    const fetchHospitalOptions = async () => {
      try {
        const response = await axios.get("/api/list/hospitals");
        setHospitalOptions(response.data.items); // 병원 목록을 상태에 저장
      } catch (error) {
        console.error("병원 목록을 불러오는 중 오류 발생:", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        if (!userId) {
          console.error("유효한 사용자 ID를 찾을 수 없습니다.");
          return;
        }

        // 광고 회사 목록 가져오기
        const companyResponse = await axios.get("/api/advertise");
        setCompanyOptions(companyResponse.data.data); // 모든 매체 저장

        // 유저 설정 가져오기
        const settingsResponse = await axios.get(
          `/api/advertise/settings/${userId}`
        );
        const settings = settingsResponse.data.data;

        if (settings && settings.advertising_data_settings) {
          // 광고 회사 ID 목록을 배열로 변환하여 체크 상태에 저장
          setCheckedCompanies(settings.advertising_data_settings);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };
    fetchHospitalOptions();
    fetchCompanies();
  }, []);

  return (
    <div className="filter-container">
      <div className="filter-group">
        {/* 병원 필터 */}
        <div className="hospital-filter">
          <div className="hospital-custom-select" onClick={handleDropdownClick}>
            {selectedHospital !== undefined
              ? hospitalOptions.find(
                  (hospital) => hospital.id === selectedHospital
                )?.name
              : "병원 전체 목록"}
            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
          </div>

          {isDropdownOpen && (
            <ul className="custom-options">
              {hospitalOptions &&
                hospitalOptions.map((hospital) => (
                  <li
                    key={hospital.id} // hospital.id를 고유 키로 사용
                    onClick={() => handleOptionClick(hospital)} // hospital 객체를 그대로 전달
                    className={`option-item ${
                      selectedHospital === hospital.id ? "selected" : ""
                    }`}
                  >
                    {hospital.name} {/* hospital.name으로 표시 */}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* 날짜 필터 */}
        <div className="date-filter-box">
          <div className="date-filter">
            <div className="custom-select" onClick={handleDateDropdownClick}>
              <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              <span>{selectedDateOption}</span>
              {/* <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" /> */}
            </div>
            <span className="lineSeper">|</span>
            {isDateDropdownOpen && (
              <ul className="custom-options">
                {dateOptions.map((option, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleDateOptionClick(option.label, option.value)
                    }
                    className={`option-item ${
                      selectedDateOption === option.label ? "selected" : ""
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* 날짜 표시 및 화살표 */}
          <div className="date-display">
            <span className="date-text">
              {customDateRange.startDate} ~ {customDateRange.endDate}
            </span>
            <div className="divider large"></div>
            <div className="arrow-group">
              <FontAwesomeIcon icon={faChevronLeft} className="arrow-icon" />
              <FontAwesomeIcon icon={faChevronRight} className="arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* 회사 필터 */}
      <div className="company-filter">
        <div
          className="company-custom-select"
          onClick={(e) => {
            e.stopPropagation();
            handleCompanyDropdownClick(e);
          }}
        >
          <input
            type="text"
            placeholder="조회할 매체를 선택하세요"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
          />
          {/* <button onClick={saveSelectedCompanies}>등록</button> */}
        </div>

        {isCompanyDropdownOpen === true && (
          <ul className="custom-options">
            {filteredCompanyOptions.map((company, index) => (
              <li
                key={index}
                className={`option-item ${
                  checkedCompanies.includes(company.id) ? "selected" : ""
                }`}
              >
                {/* 체크박스 추가 */}
                <input
                  className="companyCheckBox"
                  type="checkbox"
                  checked={checkedCompanies.includes(company.id)} // 광고 회사 설정에 있으면 체크
                  onChange={() => handleCheckboxChange(company.id)}
                />
                <span onClick={(e) => handleCompanyOptionClick(e, company)}>
                  {company.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FilterComponent;
