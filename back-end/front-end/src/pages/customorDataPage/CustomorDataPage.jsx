import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import AccordionComponent from './AccordionComponent';
import StatCard from './StatCard';
import DeleteButton from './DeleteButton';
import './customordata.scss';

function CustomorDataPage({ title, get_status, put_status }) {
    const [customors, setCustomors] = useState([]);
    const [editState, setEditState] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const limit = 10; // 한 페이지에 보여줄 데이터 수
    const [recentSettings, setRecentSettings] = useState([]);
    const [checkedCompanies, setCheckedCompanies] = useState([]); // 체크된 회사 목록
    const [companyOptions, setCompanyOptions] = useState([]); // 회사 필터 옵션

    // 회사 필터 상태 --------------------------------------------
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false); // 회사 필터 열림/닫힘 상태

    const closeCompanyDropdown = () => {
        if (isCompanyDropdownOpen) {
            setIsCompanyDropdownOpen(false);
        }
    };

    // filters 상태를 CustomorDataPage에서 관리
    const [filters, setFilters] = useState({
        dividend_status: '',
        hospital_name: '',
        event_name: '',
        advertising_company: '',
        ad_title: '',
        url_code: '',
        name: '',
        phone: '',
        date: '',
    });

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    useEffect(() => {
        fetchData(filters); // currentPage가 변경될 때마다 데이터 가져오기
    }, [currentPage]);

    const fetchData = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/customor/search', {
                data_status: get_status,
                page: currentPage,
                limit,
                ...filters,
            });

            if (response.data.total > 0) {
                setCustomors(
                    response.data.data.map((customor) => ({
                        ...customor,
                        isSelected: false,
                    }))
                );
                setTotalPages(Math.ceil(response.data.total / limit));
                const initialState = {};
                response.data.data.forEach((item) => {
                    initialState[item.id] = false;
                });
                setRecentSettings(response.data.recentSettings);
                setEditState(initialState);
            } else {
                // total이 0일 경우
                setCustomors([]); // 빈 배열로 설정
                setTotalPages(1); // 페이지를 1로 설정
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    // 매체 필터링 버튼 클릭 핸들러
    const handleMediaFilter = (company) => {
        const updatedFilters = { ...filters, advertising_company: company };
        setFilters(updatedFilters);
        fetchData(updatedFilters);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };
    const handleApplyFilters = () => {
        fetchData(filters);
    };

    const handleCheckboxChange = (index) => {
        setCustomors((prevCustomors) =>
            prevCustomors.map((customor, i) =>
                i === index ? { ...customor, isSelected: !customor.isSelected } : customor
            )
        );
    };

    const handleEdit = (id) => {
        setEditState((prev) => ({ ...prev, [id]: true }));
    };

    const handleInputChange = (index, field, value) => {
        setCustomors((prevCustomors) =>
            prevCustomors.map((customor, i) => (i === index ? { ...customor, [field]: value } : customor))
        );
    };

    const handleSubmit = async (index) => {
        const customor = customors[index];
        try {
            const response = await axios.put(`/api/customor/${customor.id}`, customor);
            console.log('Data updated successfully:', response.data);
            setEditState((prev) => ({ ...prev, [customor.id]: false }));
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handlePermanentDelete = async () => {
        const selectedIds = customors.filter((customor) => customor.isSelected).map((customor) => customor.id);
        if (selectedIds.length > 0) {
            try {
                const response = await axios.delete(`/api/customor/delete`, {
                    data: { ids: selectedIds },
                });
                console.log('Permanent delete successful:', response.data);
                alert('선택한 데이터가 영구적으로 삭제되었습니다.');
                await fetchData();
            } catch (error) {
                console.error('Error during permanent deletion:', error);
                alert('영구 삭제 중 오류가 발생했습니다.');
            }
        } else {
            alert('삭제할 데이터를 선택하세요.');
        }
    };

    const handleUpdateStatus = async () => {
        const selectedIds = customors.filter((customor) => customor.isSelected).map((customor) => customor.id);
        if (selectedIds.length > 0) {
            try {
                const response = await axios.put(`/api/customor/update-status`, {
                    ids: selectedIds,
                    data_status: put_status,
                });
                console.log('Status updated successfully:', response.data);
                alert('선택한 데이터가 삭제되었습니다.');
                await fetchData();
            } catch (error) {
                console.error('Error updating status:', error);
                alert('선택한 데이터가 삭제 중 오류가 발생했습니다.');
            }
        } else {
            alert('삭제할 데이터를 선택하세요.');
        }
    };

    console.log('checkedCompanies', checkedCompanies);
    console.log('companyOptions', companyOptions);

    return (
        <div className="DataContainer container">
            {/* <h2>{title}</h2> */}

            {/* filters 상태와 handleFilterChange 함수를 FilterComponent에 전달 */}
            <FilterComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
                checkedCompanies={checkedCompanies}
                setCheckedCompanies={setCheckedCompanies}
                companyOptions={companyOptions}
                setCompanyOptions={setCompanyOptions}
                // 매체 검색 드롭다운 설정
                isCompanyDropdownOpen={isCompanyDropdownOpen}
                setIsCompanyDropdownOpen={setIsCompanyDropdownOpen}
                closeCompanyDropdown={closeCompanyDropdown}
            />
            {/* 최근 설정 카드 */}
            <div className="itdependson" onClick={closeCompanyDropdown}>
                <div className="userSetCompany cardMarginAdded">
                    <StatCard label="DB 전체" value="139" />
                </div>
                <div className="userSetCompany cardAllSet">
                    {(typeof checkedCompanies === 'string'
                        ? checkedCompanies.split(',').map((id) => parseInt(id)) // 문자열을 배열로 변환
                        : Array.isArray(checkedCompanies)
                        ? checkedCompanies // 이미 배열인 경우 그대로 사용
                        : []
                    ) // 배열도 아니고 문자열도 아니면 빈 배열
                        .map((companyId) => {
                            // companyOptions에서 companyId와 일치하는 매체 찾기
                            const company = companyOptions.find((company) => company.id === companyId);
                            if (company) {
                                // 일치하는 회사가 있으면 StatCard에 표시
                                return <StatCard key={company.id} label={company.name} value="2" />;
                            }
                            return null; // 일치하는 회사가 없으면 아무것도 반환하지 않음
                        })}
                </div>
            </div>
            <div className="recent-settings" onClick={closeCompanyDropdown}>
                <AccordionComponent recentSettings={recentSettings} />
            </div>
            {/* 삭제 버튼 */}
            <div className="button-group" onClick={closeCompanyDropdown}>
                <DeleteButton handleUpdateStatus={handleUpdateStatus} />
                {get_status === 1 && (
                    <button onClick={() => handlePermanentDelete()} className="permanent-delete">
                        영구삭제
                    </button>
                )}
            </div>

            <table className="customor-table" onClick={closeCompanyDropdown}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>선택</th>
                        <th style={{ textAlign: 'center' }}>No</th>
                        <th>배당 여부</th>
                        <th>병원명</th>
                        <th>매체</th>
                        <th>광고 제목</th>
                        <th>이벤트명</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>일자</th>
                        <th style={{ textAlign: 'center' }}>상태</th>
                    </tr>
                </thead>
                {/* 데이터 뿌려주는 부분 */}
                <tbody>
                    {totalPages === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                                아직 데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        customors.map((customor, index) => (
                            <tr key={customor.id} className={customor.isSelected ? 'selected' : ''}>
                                <td style={{ width: '3%' }}>
                                    <input
                                        type="checkbox"
                                        checked={customor.isSelected}
                                        onChange={() => handleCheckboxChange(index)}
                                        style={{ textAlign: 'center' }}
                                    />
                                </td>
                                <td style={{ width: '2%', textAlign: 'center' }}>{customor.id}</td>
                                <td style={{ width: '5%' }}>
                                    <input
                                        type="text"
                                        value={customor.dividend_status}
                                        onChange={(e) => handleInputChange(index, 'dividend_status', e.target.value)}
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '9%' }}>
                                    <input
                                        type="text"
                                        value={customor.hospital_name}
                                        onChange={(e) => handleInputChange(index, 'hospital_name', e.target.value)}
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '5%' }}>
                                    <input
                                        type="text"
                                        value={customor.advertising_company}
                                        onChange={(e) =>
                                            handleInputChange(index, 'advertising_company', e.target.value)
                                        }
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '11%' }}>
                                    <input
                                        type="text"
                                        value={customor.ad_title}
                                        onChange={(e) => handleInputChange(index, 'ad_title', e.target.value)}
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '8%' }}>
                                    <input
                                        type="text"
                                        value={customor.event_name}
                                        onChange={(e) => handleInputChange(index, 'event_name', e.target.value)}
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '7%' }}>
                                    <input
                                        type="text"
                                        value={customor.name}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td style={{ width: '8%' }}>
                                    <input
                                        type="text"
                                        value={customor.phone ? customor.phone.split('T')[0] : ''}
                                        onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td style={{ width: '11%' }}>
                                    <input
                                        type="text"
                                        value={customor.created_at ? customor.created_at.split('.')[0] : ''}
                                        onChange={(e) => handleInputChange(index, 'created_at', e.target.value)}
                                        disabled={true}
                                    />
                                </td>
                                <td style={{ width: '3%' }}>
                                    {editState[customor.id] ? (
                                        <button className="submit-button" onClick={() => handleSubmit(index)}>
                                            저장
                                        </button>
                                    ) : (
                                        <button className="edit-button" onClick={() => handleEdit(customor.id)}>
                                            수정
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    이전
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default CustomorDataPage;
