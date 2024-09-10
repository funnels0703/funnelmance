import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

function FilterComponent({ filters, onFilterChange }) {
  const formatKoreanDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  };

  const [customDateRange, setCustomDateRange] = useState({
    startDate: formatKoreanDate(new Date()),
    endDate: formatKoreanDate(new Date()),
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 병원 필터 열림/닫힘 상태
  const [selectedOption, setSelectedOption] = useState("병원 목록 전체");

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false); // 날짜 필터 열림/닫힘 상태
  const [selectedDateOption, setSelectedDateOption] = useState("오늘");

  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); // 날짜 필터 열림/닫힘 상태

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    onFilterChange({
      ...filters,
      hospital_name: option === "병원 목록 전체" ? "" : option,
    });
  };

  const options = ["병원 목록 전체", "병원 1", "병원 2"]; // 병원 필터 옵션

  const handleDateDropdownClick = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };

  const handleCompanyDropdownClick = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };
  const handleDateOptionClick = (option, value) => {
    setSelectedDateOption(option);
    setIsDateDropdownOpen(false);
    updateDateRange(value);
  };

  const dateOptions = [
    { label: "오늘", value: "today" },
    { label: "최근 7일", value: "last7days" },
    { label: "최근 30일", value: "last30days" },
    { label: "어제", value: "yesterday" },
    { label: "지난주 (오늘 제외)", value: "lastweek" },
  ];

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

  return (
    <div className="filter-container">
      <div className="filter-group">
        {/* 병원 필터 */}
        <div className="hospital-filter">
          <div className="hospital-custom-select" onClick={handleDropdownClick}>
            {selectedOption}
            <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
          </div>

          {isDropdownOpen && (
            <ul className="custom-options">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className={`option-item ${
                    selectedOption === option ? "selected" : ""
                  }`}
                >
                  {option}
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

      <div
        className="company-custom-select"
        onClick={handleCompanyDropdownClick}
      >
        <input type="text" placeholder="조회할 매체를 선택하세요" />
        <button>등록</button>
      </div>

      <style jsx>{`
        .filter-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* 병원 필터 스타일 */
        .hospital-filter {
          position: relative;
          width: 400px;
          height: 50px;
          border-radius: 10px;
          border: 1px solid #d9d9d9;
          background: #fff;
          display: flex;
          align-items: center;
          padding: 0 15px;
        }
        .hospital-custom-select {
          width: 100%;
          height: 100%;
          border: none;
          background: none;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .company-custom-select {
          padding: 15px 17px;
          width: 301px;
          height: 50px;
          border-radius: 10px;
          border: 1px solid #d9d9d9;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          input {
            outline: none;
            font-size: 16px;
            font-weight: 500;
            border: none;
          }
          button {
            width: 54px;
            height: 27px;
            background-color: #4880ff;
            color: white;
            font-size: 12px;
            text-align: center;
            border: none;
            border-radius: 4px;
          }
        }
        .custom-select {
          width: 121px;
          height: 100%;
          border: none;
          background: none;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-around;
          span {
            width: 55px;
          }
        }

        .dropdown-icon {
          color: #707070;
          font-size: 20px;
        }

        .custom-options {
          position: absolute;
          top: 55px;
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid #d9d9d9;
          border-radius: 10px;
          z-index: 10;
          max-height: 200px;
          overflow-y: auto;
        }

        .option-item {
          padding: 10px 15px;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          background: #fff;
        }

        .option-item:hover,
        .option-item.selected {
          background-color: #f0f0f0;
        }

        /* 날짜 필터 스타일 */
        .date-filter-box {
          border: 1px solid #d9d9d9;
          display: flex;
          flex-direction: row;
          border-radius: 10px;
        }
        .date-filter {
          position: relative;

          height: 50px;
          display: flex;
          align-items: center;
          padding: 0 15px;
        }

        .date-display {
          display: flex;
          align-items: center;
        }

        .date-text {
          font-size: 16px;
          color: #333;
          white-space: nowrap;
        }

        .divider.large {
          width: 1px;
          height: 50px;
          background: #d9d9d9;
          margin: 0 15px;
        }
        .calendar-icon {
          margin: 0 10px;
        }
        .lineSeper {
          font-size: 26px;
          color: #d9d9d9;
        }
        .arrow-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .arrow-icon {
          color: #707070;
          margin: 0px 16.5px 0 7px;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default FilterComponent;
