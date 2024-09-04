import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function FilterComponent({ filters, onFilterChange }) {
    const formatKoreanDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };

    const [customDateRange, setCustomDateRange] = useState({
        startDate: formatKoreanDate(new Date()), // 기본값: 오늘 날짜
        endDate: formatKoreanDate(new Date()), // 기본값: 오늘 날짜
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'date_range') {
            updateDateRange(value);
        } else {
            onFilterChange({
                ...filters,
                [name]: value,
            });
        }
    };

    const updateDateRange = (option) => {
        const today = new Date();
        let startDate = new Date();
        let endDate = new Date();

        switch (option) {
            case 'today':
                startDate = endDate = new Date();
                break;
            case 'yesterday':
                startDate = endDate = new Date(today.setDate(today.getDate() - 1));
                break;
            case 'last7days':
                startDate = new Date(today.setDate(today.getDate() - 6));
                endDate = new Date();
                break;
            case 'last30days':
                startDate = new Date(today.setDate(today.getDate() - 29));
                endDate = new Date();
                break;
            case 'lastweek':
                const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 6));
                const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay()));
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
                    <select
                        name="hospital_name"
                        value={filters.hospital_name || ''}
                        onChange={handleChange}
                        className="filter-select"
                    >
                        <option value="">병원 목록 전체</option>
                        <option value="hospital1">병원 1</option>
                        <option value="hospital2">병원 2</option>
                        {/* 필요한 옵션 추가 */}
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
                </div>

                {/* 날짜 필터 */}
                <div className="date-filter">
                    <div className="date-select">
                        <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
                        <select name="date_range" onChange={handleChange} className="filter-select">
                            <option value="last7days">최근 7일</option>
                            <option value="last30days">최근 30일</option>
                            <option value="today">오늘</option>
                            <option value="yesterday">어제</option>
                            <option value="lastweek">지난주 (오늘 제외)</option>
                        </select>
                        {/* 구분선 */}
                        <div className="divider small"></div>
                    </div>

                    {/* 날짜 표시 및 화살표 */}
                    <div className="date-display">
                        <span className="date-text">
                            {customDateRange.startDate} ~ {customDateRange.endDate}
                        </span>
                        {/* 구분선 */}
                        <div className="divider large"></div>
                        <div className="arrow-group">
                            <FontAwesomeIcon icon={faChevronLeft} className="arrow-icon" />
                            <FontAwesomeIcon icon={faChevronRight} className="arrow-icon" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .filter-container {
                    display: flex;
                    justify-content: flex-start;
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

                .filter-select {
                    width: 100%;
                    height: 100%;
                    border: none;
                    appearance: none;
                    background: none;
                    font-size: 16px;
                    color: #333;
                    cursor: pointer;
                    padding-right: 30px; /* 아이콘과 간격 유지 */
                }

                .dropdown-icon {
                    position: absolute;
                    right: 15px;
                    pointer-events: none;
                    color: #707070;
                    font-size: 20px;
                }

                /* 날짜 필터 스타일 */
                .date-filter {
                    display: flex;
                    align-items: center;
                    height: 50px;
                    border-radius: 10px;
                    border: 1px solid #d9d9d9;
                    background: #fff;
                    padding: 0 15px;
                }

                .date-select {
                    display: flex;
                    align-items: center;
                }

                .calendar-icon {
                    color: #707070;
                    font-size: 20px;
                    margin-right: 10px;
                }

                .divider.small {
                    width: 1px;
                    height: 26px;
                    background: #d9d9d9;
                    margin: 0 15px;
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

                .arrow-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .arrow-icon {
                    color: #707070;
                    margin: 0 9.5px;
                    font-size: 14px;
                    cursor: pointer;
                }

                select:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
}

export default FilterComponent;
