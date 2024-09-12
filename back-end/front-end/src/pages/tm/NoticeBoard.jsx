import React, { useEffect, useState } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [noticeNotices, setNoticeNotices] = useState([]);
  const [generalNotices, setGeneralNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchQuery: "",
    searchTypes: { title: true, author: true, content: true },
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // 현재 연도와 월을 구해서 날짜를 설정
    const today = new Date();
    const currentYear = today.getFullYear();
    const firstMonth = "01"; // January
    const lastMonth = "12"; // December

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
        const searchTypeArray = Object.keys(searchTypes).filter(
          (type) => searchTypes[type]
        );
        console.log(searchTypeArray);
        const response = await axios.get("/api/tm/notices", {
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
        console.error(
          "Error fetching notices:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchNotices();
  }, [currentPage, filters]);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleReset = () => {
    setFilters({
      searchQuery: "",
      searchTypes: { title: false, author: false, content: false },
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1); // 초기화 시 첫 페이지로 이동
  };

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "searchQuery") {
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

  return (
    <div>
      <h1>공지사항</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="searchQuery"
          value={filters.searchQuery}
          onChange={handleFilterChange}
          placeholder="Search..."
        />
        <div>
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
        <input
          type="month"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="month"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {noticeNotices.length > 0 && (
            <>
              {noticeNotices.map((notice) => (
                <tr key={notice.id}>
                  <td>{notice.id}</td>
                  <td>{notice.title}</td>
                  <td>{notice.user.username}</td>
                  <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </>
          )}
          {generalNotices.length > 0 ? (
            generalNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>{notice.title}</td>
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
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={pageNum === currentPage}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
