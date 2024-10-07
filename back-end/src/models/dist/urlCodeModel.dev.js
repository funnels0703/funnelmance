"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// models/urlCodeModel.js
var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var prisma = new PrismaClient(); // URL 코드 데이터를 페이지네이션과 함께 가져오는 컨트롤러 함수

var getCodes = function getCodes(pageInt, limitInt) {
  var totalItems, totalPages, codes, codesWithDetails;
  return regeneratorRuntime.async(function getCodes$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(prisma.url_code_setting.count());

        case 2:
          totalItems = _context2.sent;
          // 전체 레코드 수 계산
          totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산
          // 페이지에 맞는 URL 코드 설정 데이터를 가져옴

          _context2.next = 6;
          return regeneratorRuntime.awrap(prisma.url_code_setting.findMany({
            skip: (pageInt - 1) * limitInt,
            // 페이지 건너뛰기
            take: limitInt,
            // 페이지당 가져올 항목 수
            select: {
              id: true,
              user_id: true,
              url_code: true,
              db_request_count: true,
              db_click_count: true,
              created_at: true,
              updated_at: true,
              ad_title: true,
              ad_number: true,
              event_name_id: true,
              hospital_name_id: true,
              advertising_company_id: true,
              ad_spending: true
            }
          }));

        case 6:
          codes = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(Promise.all(codes.map(function _callee(code) {
            var _ref, _ref2, hospital, advertisingCompany, eventName;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Promise.all([code.hospital_name_id ? prisma.hospital_name.findUnique({
                      where: {
                        id: code.hospital_name_id
                      },
                      select: {
                        name: true
                      }
                    }) : null, code.advertising_company_id ? prisma.advertising_company.findUnique({
                      where: {
                        id: code.advertising_company_id
                      },
                      select: {
                        name: true
                      }
                    }) : null, code.event_name_id ? prisma.event_name.findUnique({
                      where: {
                        id: code.event_name_id
                      },
                      select: {
                        name: true
                      }
                    }) : null]));

                  case 2:
                    _ref = _context.sent;
                    _ref2 = _slicedToArray(_ref, 3);
                    hospital = _ref2[0];
                    advertisingCompany = _ref2[1];
                    eventName = _ref2[2];
                    return _context.abrupt("return", _objectSpread({}, code, {
                      hospital_name: hospital ? hospital.name : null,
                      // 병원 이름이 있을 경우 추가
                      advertising_company_name: advertisingCompany ? advertisingCompany.name : null,
                      // 광고 회사 이름이 있을 경우 추가
                      event_name: eventName ? eventName.name : null // 이벤트 이름이 있을 경우 추가

                    }));

                  case 8:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 9:
          codesWithDetails = _context2.sent;
          return _context2.abrupt("return", {
            codesWithDetails: codesWithDetails,
            totalPages: totalPages
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function checkCodeUniqueness(url_code) {
  var existingCode;
  return regeneratorRuntime.async(function checkCodeUniqueness$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(prisma.url_code_setting.findUnique({
            where: {
              url_code: url_code
            }
          }));

        case 2:
          existingCode = _context3.sent;
          return _context3.abrupt("return", !existingCode);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function createUrlCode(data) {
  return regeneratorRuntime.async(function createUrlCode$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(prisma.url_code_setting.create({
            data: data
          }));

        case 2:
          return _context4.abrupt("return", _context4.sent);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
} // 접속 처리
// URL 코드 데이터 조회


function findCodeByUrlCode(urlCode) {
  return regeneratorRuntime.async(function findCodeByUrlCode$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(prisma.url_code_setting.findUnique({
            where: {
              url_code: urlCode
            },
            select: {
              url_code: true,
              // 필요한 경우, 이 필드도 포함
              ad_number: true // ad_number 필드를 가져옴
              // 필요하다면 다른 필드도 추가할 수 있습니다

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
} // // IP로 기존 클릭 기록 확인
// async function findClickByIpAndCode(urlCode, ip) {
//   return await prisma.click.findUnique({
//     where: {
//       url_code_ip: {
//         url_code: urlCode,
//         ip: ip,
//       },
//     },
//   });
// }
// 클릭 카운트 증가


function incrementClickCount(urlCode) {
  return regeneratorRuntime.async(function incrementClickCount$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(prisma.url_code_setting.update({
            where: {
              url_code: urlCode
            },
            data: {
              db_click_count: {
                increment: 1
              }
            }
          }));

        case 2:
          return _context6.abrupt("return", _context6.sent);

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
} // 새로운 클릭 기록 추가


function createClickRecord(urlCode, ip) {
  return regeneratorRuntime.async(function createClickRecord$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(prisma.click.create({
            data: {
              url_code: urlCode,
              ip: ip
            }
          }));

        case 3:
          return _context7.abrupt("return", _context7.sent);

        case 6:
          _context7.prev = 6;
          _context7.t0 = _context7["catch"](0);

          if (!(_context7.t0.code === "P2002")) {
            _context7.next = 13;
            break;
          }

          // 중복된 레코드에 대한 처리 (예: 업데이트하거나, 오류 메시지 반환)
          console.log("This record already exists.");
          return _context7.abrupt("return", null);

        case 13:
          throw _context7.t0;

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

module.exports = {
  getCodes: getCodes,
  checkCodeUniqueness: checkCodeUniqueness,
  createUrlCode: createUrlCode,
  // 접속 처리
  findCodeByUrlCode: findCodeByUrlCode,
  // findClickByIpAndCode,
  incrementClickCount: incrementClickCount,
  createClickRecord: createClickRecord
};