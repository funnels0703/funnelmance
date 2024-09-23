import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const dummyData = {
    noticeNotices: [
        {
            id: 1,
            title: '2024년 신년 인사 공지',
            user: { username: 'admin' },
            created_at: '2024-01-01T09:00:00Z',
        },
        {
            id: 2,
            title: '시스템 점검 안내',
            user: { username: 'system' },
            created_at: '2024-01-10T10:00:00Z',
        },
    ],
    generalNotices: [
        {
            id: 3,
            title: '회원가입 이벤트 안내',
            user: { username: 'user1' },
            created_at: '2024-02-15T15:30:00Z',
        },
        {
            id: 4,
            title: '봄맞이 할인 행사 공지',
            user: { username: 'user2' },
            created_at: '2024-03-10T14:20:00Z',
        },
        {
            id: 5,
            title: '서비스 개선 설문조사 참여 요청',
            user: { username: 'user3' },
            created_at: '2024-03-20T11:45:00Z',
        },
    ],
};

const NoticeBoard = () => {
    const [noticeNotices, setNoticeNotices] = useState([]);
    const [generalNotices, setGeneralNotices] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        searchQuery: '',
        searchTypes: { title: true, author: true, content: true },
        startDate: '',
        endDate: '',
    });
    const navigate = useNavigate(); // navigate 함수 사용

    useEffect(() => {
        // 현재 연도와 월을 구해서 날짜를 설정
        const today = new Date();
        const currentYear = today.getFullYear();
        const firstMonth = '01'; // January
        const lastMonth = '12'; // December

        setFilters((prevFilters) => ({
            ...prevFilters,
            startDate: `${currentYear}-${firstMonth}`,
            endDate: `${currentYear}-${lastMonth}`,
        }));
    }, []);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const { searchQuery, searchTypes, startDate, endDate } = filters;

                // searchTypes를 배열로 변환
                const searchTypeArray = Object.keys(searchTypes).filter((type) => searchTypes[type]);
                console.log(searchTypeArray);
                const response = await axios.get('/api/tm/notices', {
                    params: {
                        page: currentPage,
                        searchQuery, // 검색어
                        searchTypes: searchTypeArray, // 검색 타입 배열
                        startDate, // 시작 날짜
                        endDate, // 종료 날짜
                    },
                });
                console.log(response);

                const { noticeNotices, generalNotices, totalPages } = response.data;
                setNoticeNotices(noticeNotices);
                setGeneralNotices(generalNotices);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching notices:', error.response ? error.response.data : error.message);
            }
        };

        fetchNotices();
    }, [currentPage, filters]);

    // useEffect(() => {
    //   setNoticeNotices(dummyData.noticeNotices);
    //   setGeneralNotices(dummyData.generalNotices);
    //   setTotalPages(1); // 더미 데이터에 맞춰서 페이지 수 설정
    // }, []);

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    const handleReset = () => {
        setFilters({
            searchQuery: '',
            searchTypes: { title: false, author: false, content: false },
            startDate: '',
            endDate: '',
        });
        setCurrentPage(1); // 초기화 시 첫 페이지로 이동
    };

    const handleFilterChange = (event) => {
        const { name, value, checked } = event.target;
        if (name === 'searchQuery') {
            setFilters((prevFilters) => ({
                ...prevFilters,
                searchQuery: value,
            }));
        } else if (name in filters.searchTypes) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                searchTypes: {
                    ...prevFilters.searchTypes,
                    [name]: checked,
                },
            }));
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [name]: value,
            }));
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        // 검색 버튼 클릭 시에만 데이터 가져오기
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const handleRowClick = (id) => {
        navigate(`/tm/notices/${id}`); // 게시글 ID를 포함한 경로로 이동
    };

    const handleNewClick = (id) => {
        navigate(`/tm/notices/new`); // 게시글 ID를 포함한 경로로 이동
    };

    return (
        <div className="notice_board_container container">
            <form onSubmit={handleSearch}>
                <div className="search_box">
                    <div className="search_type_box">
                        <div className="search_types">
                            <label>
                                <input
                                    type="checkbox"
                                    name="title"
                                    checked={filters.searchTypes.title}
                                    onChange={handleFilterChange}
                                />
                                제목
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="author"
                                    checked={filters.searchTypes.author}
                                    onChange={handleFilterChange}
                                />
                                작성자
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="content"
                                    checked={filters.searchTypes.content}
                                    onChange={handleFilterChange}
                                />
                                내용
                            </label>
                        </div>
                    </div>
                    <input
                        type="text"
                        name="searchQuery"
                        value={filters.searchQuery}
                        onChange={handleFilterChange}
                        placeholder="검색할 내용을 입력하세요."
                    />
                </div>
                <div className="search_date">
                    날짜{` `}
                    <input type="month" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                    {` `}~{` `}
                    <input type="month" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </div>
                <button type="button" onClick={handleReset}>
                    검색 초기화
                </button>
                <button onClick={handleNewClick}>+ 새글 작성</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {noticeNotices.length > 0 && (
                        <>
                            {noticeNotices.map((notice) => (
                                <tr key={notice.id} className="notice_tr" onClick={() => handleRowClick(notice.id)}>
                                    <td>
                                        <img src="/images/notice/notice_icon.png" alt="공지사항" />
                                    </td>
                                    <td className="notice_title">{notice.title}</td>
                                    <td>{notice.user.username}</td>
                                    <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </>
                    )}
                    {generalNotices.length > 0 ? (
                        generalNotices.map((notice) => (
                            <tr key={notice.id} className="general_tr" onClick={() => handleRowClick(notice.id)}>
                                <td>{notice.id}</td>
                                <td className="notice_title">{notice.title}</td>
                                <td>{notice.user.username}</td>
                                <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No general posts available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                    <button key={pageNum} onClick={() => handlePageChange(pageNum)} disabled={pageNum === currentPage}>
                        {pageNum}
                    </button>
                ))}
            </div>
            <style jsx>
                {`
                    .notice_board_container {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        form {
                            display: flex;
                            align-items: center;
                            height: 30px;
                            margin-bottom: 20px;
                            gap: 10px;
                            .search_box {
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                height: 100%;
                                display: flex;
                                .search_type_box {
                                    border-right: 1px solid #ccc;
                                    padding: 0 8px;
                                    display: flex;
                                    align-items: center;
                                    .search_types {
                                        display: flex;
                                        gap: 10px;
                                        input {
                                            margin-right: 3px;
                                        }
                                    }
                                }
                                > input {
                                    border: none;
                                    padding: 0 8px;
                                }
                            }
                            .search_date {
                                height: 100%;
                                input {
                                    border: 1px solid #ccc;
                                    border-radius: 5px;
                                    height: 100%;
                                    padding: 0 8x;
                                }
                            }
                            button {
                                border-radius: 5px;
                                background: #4880ff;
                                color: #fff;
                                border: none;
                                font-size: 16px;
                                font-weight: 600;
                                padding: 5px 10px;
                            }
                        }
                        table {
                            width: 100%;
                            border-spacing: 0;
                            text-align: center;
                            font-size: 14px;
                            font-weight: 500;
                            color: #525252;
                            thead {
                                background-color: #fff;
                                box-shadow: 0 0 5px rgb(0 0 0 / 20%);
                                position: sticky;
                                top: 0;
                                z-index: 3;
                            }
                            tr {
                                width: 100%;
                                &.notice_tr {
                                    background-color: #fffcf3;
                                    font-weight: 600;
                                }
                                th {
                                    border-top: 1px solid #f5f5f5;
                                    border-bottom: 1px solid #f5f5f5;
                                    height: 45px;
                                    line-height: 45px;
                                }
                                td {
                                    height: 45px;
                                    line-height: 45px;
                                    border-bottom: 1px solid #f5f5f5;
                                    img {
                                        height: 60%;
                                        padding-top: 8px;
                                    }
                                    &.notice_title {
                                        text-align: left;
                                    }
                                }
                            }
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default NoticeBoard;
