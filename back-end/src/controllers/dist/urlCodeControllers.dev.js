"use strict";

// controllers/urlCodeController.js
var _require = require("../models/urlCodeModel"),
    getCodes = _require.getCodes,
    createUrlCode = _require.createUrlCode,
    findCodeByUrlCode = _require.findCodeByUrlCode,
    updateUrlCode = _require.updateUrlCode,
    deleteUrlCode = _require.deleteUrlCode,
    findClickByIpAndCode = _require.findClickByIpAndCode,
    incrementClickCount = _require.incrementClickCount,
    createClickRecord = _require.createClickRecord,
    checkCodeUniqueness = _require.checkCodeUniqueness;

var getCodesController = function getCodesController(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, pageInt, limitInt, _ref, codesWithDetails, totalPages;

  return regeneratorRuntime.async(function getCodesController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          pageInt = parseInt(page, 10);
          limitInt = parseInt(limit, 10);
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(getCodes(pageInt, limitInt));

        case 6:
          _ref = _context.sent;
          codesWithDetails = _ref.codesWithDetails;
          totalPages = _ref.totalPages;
          res.status(200).json({
            codesWithDetails: codesWithDetails,
            // 가져온 코드 데이터 반환
            totalPages: totalPages,
            // 전체 페이지 수
            currentPage: pageInt // 현재 페이지

          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            error: "코드 조회 중 오류가 발생했습니다.",
            details: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 12]]);
};

var createUrlCodeController = function createUrlCodeController(req, res) {
  var _req$body, ad_title, ad_number, hospital_name_id, event_name_id, advertising_company_id, url_code, isUnique, newUrlCode;

  return regeneratorRuntime.async(function createUrlCodeController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, ad_title = _req$body.ad_title, ad_number = _req$body.ad_number, hospital_name_id = _req$body.hospital_name_id, event_name_id = _req$body.event_name_id, advertising_company_id = _req$body.advertising_company_id, url_code = _req$body.url_code;
          user_id = 1;
          console.log("url_code", url_code);
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(checkCodeUniqueness(url_code));

        case 6:
          isUnique = _context2.sent;

          if (!isUnique) {
            _context2.next = 15;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(createUrlCode({
            ad_title: ad_title,
            ad_number: ad_number,
            hospital_name_id: hospital_name_id,
            event_name_id: event_name_id,
            advertising_company_id: advertising_company_id,
            url_code: url_code,
            user_id: user_id
          }));

        case 10:
          newUrlCode = _context2.sent;
          res.status(201).json(newUrlCode);
          console.log("newUrlCode", newUrlCode);
          _context2.next = 16;
          break;

        case 15:
          return _context2.abrupt("return", res.status(400).json({
            error: "Code already exists"
          }));

        case 16:
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](3);
          console.error("Error creating URL code:", _context2.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 18]]);
};

var updateCodesController = function updateCodesController(req, res) {
  var id, updatedFields, updatedUrlCode;
  return regeneratorRuntime.async(function updateCodesController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id; // id는 req.params에서 가져옴

          updatedFields = req.body; // 업데이트할 데이터는 req.body에서 가져옴

          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(updateUrlCode(Number(id), updatedFields));

        case 5:
          updatedUrlCode = _context3.sent;
          console.log(updatedUrlCode);

          if (updatedUrlCode) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "URL 코드가 존재하지 않습니다."
          }));

        case 9:
          res.status(200).json({
            message: "URL 코드가 성공적으로 업데이트 되었습니다."
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](2);
          console.error("업데이트 오류:", _context3.t0);
          res.status(500).json({
            message: "서버 오류"
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 12]]);
}; // URL 코드 삭제 컨트롤러


var deleteUrlCodeController = function deleteUrlCodeController(req, res) {
  var id, deletedUrlCode;
  return regeneratorRuntime.async(function deleteUrlCodeController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(deleteUrlCode(Number(id)));

        case 4:
          deletedUrlCode = _context4.sent;

          if (deletedUrlCode) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "URL 코드가 존재하지 않습니다."
          }));

        case 7:
          res.status(200).json({
            message: "URL 코드가 성공적으로 삭제되었습니다."
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](1);
          console.error("삭제 오류:", _context4.t0);
          res.status(500).json({
            message: "서버 오류"
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // URL 코드에 해당하는 데이터 가져오기 및 클릭 카운트 증가


function getUrlCodeData(req, res) {
  var urlCode, codeData;
  return regeneratorRuntime.async(function getUrlCodeData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          urlCode = req.params.urlCode; // const clientIp = req.headers["x-forwarded-for"] || req.ip;

          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(findCodeByUrlCode(urlCode));

        case 4:
          codeData = _context5.sent;

          if (codeData) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "Code not found"
          }));

        case 7:
          // IP 주소로 기존 클릭 기록 확인
          // const existingClick = await findClickByIpAndCode(urlCode, clientIp);
          // if (!existingClick) {
          // 클릭 카운트 증가
          // await incrementClickCount(urlCode);
          // 클릭 기록 추가
          // await createClickRecord(urlCode, clientIp);
          // }
          res.json(codeData);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          console.error("Error fetching code:", _context5.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
}

function postUrlCodeData(req, res) {
  var urlCode, clientIp;
  return regeneratorRuntime.async(function postUrlCodeData$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          urlCode = req.params.urlCode;
          clientIp = req.headers["x-forwarded-for"] || req.ip;
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(incrementClickCount(urlCode));

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(createClickRecord(urlCode, clientIp));

        case 7:
          res.status(200).json({
            message: "Click count incremented and record created successfully"
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](2);
          console.error("Error processing click:", _context6.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 10]]);
}

module.exports = {
  getCodesController: getCodesController,
  createUrlCodeController: createUrlCodeController,
  deleteUrlCodeController: deleteUrlCodeController,
  updateCodesController: updateCodesController,
  // 접속처리
  getUrlCodeData: getUrlCodeData,
  postUrlCodeData: postUrlCodeData
};