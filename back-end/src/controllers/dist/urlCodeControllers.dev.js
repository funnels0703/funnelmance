"use strict";

// controllers/urlCodeController.js
var _require = require("../models/urlCodeModel"),
    getCodes = _require.getCodes,
    findCodeByUrlCode = _require.findCodeByUrlCode,
    findClickByIpAndCode = _require.findClickByIpAndCode,
    incrementClickCount = _require.incrementClickCount,
    createClickRecord = _require.createClickRecord,
    checkCodeUniqueness = _require.checkCodeUniqueness,
    createUrlCode = _require.createUrlCode;

var getCodesController = function getCodesController(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, pageInt, limitInt, _ref, codes, totalPages;

  return regeneratorRuntime.async(function getCodesController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          pageInt = parseInt(page, 10);
          limitInt = parseInt(limit, 10);
          _context.prev = 3;
          console.log(111); // 모델에서 URL 코드 설정 데이터를 가져옴

          _context.next = 7;
          return regeneratorRuntime.awrap(getCodes(pageInt, limitInt));

        case 7:
          _ref = _context.sent;
          codes = _ref.codes;
          totalPages = _ref.totalPages;
          res.status(200).json({
            codes: codes,
            // 가져온 코드 데이터 반환
            totalPages: totalPages,
            // 전체 페이지 수
            currentPage: pageInt // 현재 페이지

          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            error: "코드 조회 중 오류가 발생했습니다.",
            details: _context.t0.message
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 13]]);
};

var createUrlCodeController = function createUrlCodeController(req, res) {
  var _req$body, ad_title, ad_number, hospital_name, event_name, advertising_company, url_code, isUnique, newUrlCode;

  return regeneratorRuntime.async(function createUrlCodeController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, ad_title = _req$body.ad_title, ad_number = _req$body.ad_number, hospital_name = _req$body.hospital_name, event_name = _req$body.event_name, advertising_company = _req$body.advertising_company, url_code = _req$body.url_code;
          user_id = 1;
          console.log(url_code);
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(checkCodeUniqueness(url_code));

        case 6:
          isUnique = _context2.sent;

          if (isUnique) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Code already exists"
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(createUrlCode({
            ad_title: ad_title,
            ad_number: ad_number,
            hospital_name: hospital_name,
            event_name: event_name,
            advertising_company: advertising_company,
            url_code: url_code,
            user_id: user_id
          }));

        case 11:
          newUrlCode = _context2.sent;
          res.status(201).json(newUrlCode);
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](3);
          console.error("Error creating URL code:", _context2.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 15]]);
}; // URL 코드에 해당하는 데이터 가져오기 및 클릭 카운트 증가


function getUrlCodeData(req, res) {
  var urlCode, codeData;
  return regeneratorRuntime.async(function getUrlCodeData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          urlCode = req.params.urlCode; // const clientIp = req.headers["x-forwarded-for"] || req.ip;

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(findCodeByUrlCode(urlCode));

        case 4:
          codeData = _context3.sent;

          if (codeData) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
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
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](1);
          console.error("Error fetching code:", _context3.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 10]]);
}

function postUrlCodeData(req, res) {
  var urlCode, clientIp;
  return regeneratorRuntime.async(function postUrlCodeData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          urlCode = req.params.urlCode;
          clientIp = req.headers["x-forwarded-for"] || req.ip;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(incrementClickCount(urlCode));

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(createClickRecord(urlCode, clientIp));

        case 7:
          res.status(200).json({
            message: "Click count incremented and record created successfully"
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](2);
          console.error("Error processing click:", _context4.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 10]]);
}

module.exports = {
  getCodesController: getCodesController,
  createUrlCodeController: createUrlCodeController,
  // 접속처리
  getUrlCodeData: getUrlCodeData,
  postUrlCodeData: postUrlCodeData
};