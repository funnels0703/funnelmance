// src/controllers/noticeController.js

const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../models/noticeModel");

// 공지사항 조회 컨트롤러
const getNoticesController = async (req, res) => {
  const {
    page = 1,
    searchQuery = "",
    searchTypes = [], // 배열로 받음
    startDate = "",
    endDate = "",
  } = req.query;

  try {
    // getNotices 함수에 페이지 번호와 필터를 전달
    const { notices, totalPages } = await getNotices(
      parseInt(page), // 페이지 번호
      searchQuery, // 검색어
      searchTypes, // 검색 구분 배열
      startDate, // 시작 날짜
      endDate // 종료 날짜
    );

    res.status(200).json({
      noticeNotices: notices.noticeNotices, // NOTICE 공지사항
      generalNotices: notices.generalNotices, // 페이지네이션 적용된 GENERAL 게시글
      totalPages, // GENERAL 게시글에 대한 총 페이지 수 반환
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "공지사항 조회 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const getNoticeByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const notice = await getNoticeById(id);
    if (notice) {
      res.status(200).json(notice);
    } else {
      res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });
    }
  } catch (error) {
    res.status(500).json({
      error: "공지사항 조회 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const createNoticeController = async (req, res) => {
  const { title, content, type, author_id } = req.body;
  console.log(title, content, type, author_id);
  try {
    const newNotice = await createNotice({ title, content, type, author_id });
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({
      error: "공지사항 생성 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const updateNoticeController = async (req, res) => {
  const { id } = req.params;
  const { title, content, type } = req.body;
  try {
    const updatedNotice = await updateNotice(id, { title, content, type });
    res.status(200).json(updatedNotice);
  } catch (error) {
    res.status(500).json({
      error: "공지사항 수정 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const deleteNoticeController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteNotice(id);
    res.status(204).send(); // 삭제 성공 시 빈 응답
  } catch (error) {
    res.status(500).json({
      error: "공지사항 삭제 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

module.exports = {
  getNoticesController,
  getNoticeByIdController,
  createNoticeController,
  updateNoticeController,
  deleteNoticeController,
};
