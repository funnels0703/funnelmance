"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// src/models/noticeModel.js
var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var prisma = new PrismaClient(); // 공지사항 데이터 가져오기 (페이지네이션 적용)

var getNotices = function getNotices() {
  var page,
      searchQuery,
      searchTypes,
      startDate,
      endDate,
      PAGE_SIZE,
      noticeWhereCondition,
      noticeNotices,
      generalWhereCondition,
      totalGeneralCount,
      generalNotices,
      totalPages,
      _args = arguments;
  return regeneratorRuntime.async(function getNotices$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          page = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;
          searchQuery = _args.length > 1 && _args[1] !== undefined ? _args[1] : "";
          searchTypes = _args.length > 2 && _args[2] !== undefined ? _args[2] : [];
          startDate = _args.length > 3 && _args[3] !== undefined ? _args[3] : "";
          endDate = _args.length > 4 && _args[4] !== undefined ? _args[4] : "";
          PAGE_SIZE = 5; // NOTICE 공지사항 조회 조건

          noticeWhereCondition = _objectSpread({
            type: "NOTICE"
          }, searchQuery && {
            OR: searchTypes.map(function (type) {
              if (type === "author") {
                return {
                  user: {
                    username: {
                      contains: searchQuery // 대소문자 구분 없음

                    }
                  }
                };
              }

              return _defineProperty({}, type, {
                contains: searchQuery // 대소문자 구분 없음

              });
            })
          }); // NOTICE 공지사항 조회

          _context.next = 9;
          return regeneratorRuntime.awrap(prisma.notice_board.findMany({
            where: noticeWhereCondition,
            select: {
              id: true,
              title: true,
              created_at: true,
              type: true,
              author_id: true,
              user: {
                select: {
                  username: true
                }
              }
            },
            orderBy: {
              created_at: "desc"
            }
          }));

        case 9:
          noticeNotices = _context.sent;
          // GENERAL 게시글 조회 조건
          generalWhereCondition = _objectSpread({
            type: "GENERAL"
          }, searchQuery && {
            OR: searchTypes.map(function (type) {
              if (type === "author") {
                return {
                  user: {
                    username: {
                      contains: searchQuery // 대소문자 구분 없음

                    }
                  }
                };
              }

              return _defineProperty({}, type, {
                contains: searchQuery // 대소문자 구분 없음

              });
            })
          }, {}, startDate && endDate && {
            created_at: {
              gte: new Date("".concat(startDate, "-01")),
              // 시작일
              lte: new Date("".concat(endDate, "-01T23:59:59")) // 종료일

            }
          }); // GENERAL 게시글의 총 개수

          _context.next = 13;
          return regeneratorRuntime.awrap(prisma.notice_board.count({
            where: generalWhereCondition
          }));

        case 13:
          totalGeneralCount = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(prisma.notice_board.findMany({
            where: generalWhereCondition,
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            select: {
              id: true,
              title: true,
              created_at: true,
              type: true,
              author_id: true,
              user: {
                select: {
                  username: true
                }
              }
            },
            orderBy: {
              created_at: "desc"
            }
          }));

        case 16:
          generalNotices = _context.sent;
          // 총 페이지 수 계산
          totalPages = Math.ceil(totalGeneralCount / PAGE_SIZE);
          return _context.abrupt("return", {
            notices: {
              noticeNotices: noticeNotices,
              generalNotices: generalNotices
            },
            totalPages: totalPages
          });

        case 19:
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