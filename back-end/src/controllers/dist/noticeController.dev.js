"use strict";

// src/controllers/noticeController.js
var _require = require("../models/noticeModel"),
    getNotices = _require.getNotices,
    getNoticeById = _require.getNoticeById,
    createNotice = _require.createNotice,
    updateNotice = _require.updateNotice,
    deleteNotice = _require.deleteNotice; // 공지사항 조회 컨트롤러


var getNoticesController = function getNoticesController(req, res) {
  var _req$query, _req$query$page, page, _req$query$searchQuer, searchQuery, _req$query$searchType, searchTypes, _req$query$startDate, startDate, _req$query$endDate, endDate, _ref, notices, totalPages;

  return regeneratorRuntime.async(function getNoticesController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$searchQuer = _req$query.searchQuery, searchQuery = _req$query$searchQuer === void 0 ? "" : _req$query$searchQuer, _req$query$searchType = _req$query.searchTypes, searchTypes = _req$query$searchType === void 0 ? [] : _req$query$searchType, _req$query$startDate = _req$query.startDate, startDate = _req$query$startDate === void 0 ? "" : _req$query$startDate, _req$query$endDate = _req$query.endDate, endDate = _req$query$endDate === void 0 ? "" : _req$query$endDate;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(getNotices(parseInt(page), // 페이지 번호
          searchQuery, // 검색어
          searchTypes, // 검색 구분 배열
          startDate, // 시작 날짜
          endDate // 종료 날짜
          ));

        case 4:
          _ref = _context.sent;
          notices = _ref.notices;
          totalPages = _ref.totalPages;
          res.status(200).json({
            noticeNotices: notices.noticeNotices,
            // NOTICE 공지사항
            generalNotices: notices.generalNotices,
            // 페이지네이션 적용된 GENERAL 게시글
            totalPages: totalPages // GENERAL 게시글에 대한 총 페이지 수 반환

          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.error("Server error:", _context.t0);
          res.status(500).json({
            error: "공지사항 조회 중 오류가 발생했습니다.",
            details: _context.t0.message
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

var getNoticeByIdController = function getNoticeByIdController(req, res) {
  var id, notice;
  return regeneratorRuntime.async(function getNoticeByIdController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(getNoticeById(id));

        case 4:
          notice = _context2.sent;

          if (notice) {
            res.status(200).json(notice);
          } else {
            res.status(404).json({
              error: "공지사항을 찾을 수 없습니다."
            });
          }

          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: "공지사항 조회 중 오류가 발생했습니다.",
            details: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
};

var createNoticeController = function createNoticeController(req, res) {
  var _req$body, title, content, type, author_id, newNotice;

  return regeneratorRuntime.async(function createNoticeController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, content = _req$body.content, type = _req$body.type, author_id = _req$body.author_id;
          console.log(title, content, type, author_id);
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(createNotice({
            title: title,
            content: content,
            type: type,
            author_id: author_id
          }));

        case 5:
          newNotice = _context3.sent;
          res.status(201).json(newNotice);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](2);
          res.status(500).json({
            error: "공지사항 생성 중 오류가 발생했습니다.",
            details: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var updateNoticeController = function updateNoticeController(req, res) {
  var id, _req$body2, title, content, type, updatedNotice;

  return regeneratorRuntime.async(function updateNoticeController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, title = _req$body2.title, content = _req$body2.content, type = _req$body2.type;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(updateNotice(id, {
            title: title,
            content: content,
            type: type
          }));

        case 5:
          updatedNotice = _context4.sent;
          res.status(200).json(updatedNotice);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          res.status(500).json({
            error: "공지사항 수정 중 오류가 발생했습니다.",
            details: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
};

var deleteNoticeController = function deleteNoticeController(req, res) {
  var id;
  return regeneratorRuntime.async(function deleteNoticeController$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(deleteNotice(id));

        case 4:
          res.status(204).send(); // 삭제 성공 시 빈 응답

          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            error: "공지사항 삭제 중 오류가 발생했습니다.",
            details: _context5.t0.message
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

module.exports = {
  getNoticesController: getNoticesController,
  getNoticeByIdController: getNoticeByIdController,
  createNoticeController: createNoticeController,
  updateNoticeController: updateNoticeController,
  deleteNoticeController: deleteNoticeController
};