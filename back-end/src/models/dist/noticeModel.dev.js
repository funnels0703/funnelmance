"use strict";

// src/models/noticeModel.js
var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var prisma = new PrismaClient();

var getNotices = function getNotices() {
  var notices;
  return regeneratorRuntime.async(function getNotices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(prisma.notice_board.findMany({
            select: {
              id: true,
              title: true,
              created_at: true,
              type: true,
              author_id: true,
              user: {
                // 작성자 정보도 포함
                select: {
                  username: true
                }
              }
            }
          }));

        case 2:
          notices = _context.sent;
          return _context.abrupt("return", notices);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getNoticeById = function getNoticeById(id) {
  return regeneratorRuntime.async(function getNoticeById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(prisma.notice_board.findUnique({
            where: {
              id: parseInt(id)
            },
            include: {
              user: {
                select: {
                  username: true
                }
              }
            }
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var createNotice = function createNotice(noticeData) {
  var title, content, type, author_id;
  return regeneratorRuntime.async(function createNotice$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          title = noticeData.title, content = noticeData.content, type = noticeData.type, author_id = noticeData.author_id;
          console.log(noticeData);
          _context3.next = 4;
          return regeneratorRuntime.awrap(prisma.notice_board.create({
            data: {
              title: title,
              content: content,
              type: type,
              author_id: author_id
            }
          }));

        case 4:
          return _context3.abrupt("return", _context3.sent);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var updateNotice = function updateNotice(id, data) {
  return regeneratorRuntime.async(function updateNotice$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(prisma.notice_board.update({
            where: {
              id: parseInt(id)
            },
            data: {
              title: data.title,
              content: data.content,
              type: data.type
            }
          }));

        case 2:
          return _context4.abrupt("return", _context4.sent);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var deleteNotice = function deleteNotice(id) {
  return regeneratorRuntime.async(function deleteNotice$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(prisma.notice_board["delete"]({
            where: {
              id: parseInt(id)
            }
          }));

        case 2:
          return _context5.abrupt("return", _context5.sent);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  getNotices: getNotices,
  getNoticeById: getNoticeById,
  createNotice: createNotice,
  updateNotice: updateNotice,
  deleteNotice: deleteNotice
};