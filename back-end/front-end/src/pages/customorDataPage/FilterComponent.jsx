import React, { useState } from 'react';

function FilterComponent({ onFilterChange }) {
    const [filters, setFilters] = useState({
        dividend_status: '',
        hospital_name: '',
        advertising_company: '',
        ad_title: '',
        url_code: '',
        name: '',
        phone: '',
        date: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilter = () => {
        onFilterChange(filters);
    };

    return (
        <div className="filter-container">
            <div className="filter-group">
                <input
                    type="text"
                    name="dividend_status"
                    value={filters.dividend_status}
                    onChange={handleChange}
                    placeholder="배당 여부 (Y/N)"
                />
                <input
                    type="text"
                    name="hospital_name"
                    value={filters.hospital_name}
                    onChange={handleChange}
                    placeholder="병원명"
                />
                <input
                    type="text"
                    name="advertising_company"
                    value={filters.advertising_company}
                    onChange={handleChange}
                    placeholder="광고 회사"
                />
                <input
                    type="text"
                    name="ad_title"
                    value={filters.ad_title}
                    onChange={handleChange}
                    placeholder="광고 제목"
                />
            </div>
            <div className="filter-group">
                <input
                    type="text"
                    name="url_code"
                    value={filters.url_code}
                    onChange={handleChange}
                    placeholder="URL 코드"
                />
                <input type="text" name="name" value={filters.name} onChange={handleChange} placeholder="이름" />
                <input type="text" name="phone" value={filters.phone} onChange={handleChange} placeholder="전화번호" />
                <input type="date" name="date" value={filters.date} onChange={handleChange} />
            </div>
            <button onClick={handleFilter} className="filter-button">
                필터 적용
            </button>
            <style jsx>{`
                .filter-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
                    padding: 15px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    .filter-group {
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    }

                    input {
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        flex: 1;
                        min-width: 150px;
                        background-color: white;
                        font-size: 14px;
                        transition: border-color 0.3s ease;
                    }

                    input:focus {
                        border-color: #007bff;
                        outline: none;
                    }

                    .filter-button {
                        align-self: flex-end;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.3s ease;
                    }

                    .filter-button:hover {
                        background-color: #0056b3;
                    }
                }
            `}</style>
        </div>
    );
}

export default FilterComponent;
