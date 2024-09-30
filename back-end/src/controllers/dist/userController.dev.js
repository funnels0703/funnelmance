"use strict";

// src/controllers/userController.js
var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var prisma = new PrismaClient();

var _require2 = require("../models/usersModel"),
    getAllUsers = _require2.getAllUsers,
    createUser = _require2.createUser,
    updateUser = _require2.updateUser,
    getUserByUsername = _require2.getUserByUsername;

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var createUserController = function createUserController(req, res) {
  var newUser;
  return regeneratorRuntime.async(function createUserController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log(1);
          _context.next = 4;
          return regeneratorRuntime.awrap(createUser(req.body));

        case 4:
          newUser = _context.sent;
          console.log(newUser);
          res.status(201).json(newUser);
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: "유저 생성 중 오류가 발생했습니다.",
            details: _context.t0.message
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getAllUsersController = function getAllUsersController(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, pageInt, limitInt, totalItems, totalPages, users;

  return regeneratorRuntime.async(function getAllUsersController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit; // 클라이언트에서 페이지와 항목 수를 받음

          pageInt = parseInt(page, 10);
          limitInt = parseInt(limit, 10);
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(prisma.user.count());

        case 6:
          totalItems = _context2.sent;
          // 전체 유저 수 계산
          totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산
          // 유저 데이터 가져오기 (페이지네이션 적용)

          _context2.next = 10;
          return regeneratorRuntime.awrap(prisma.user.findMany({
            skip: (pageInt - 1) * limitInt,
            // 페이지 건너뛰기
            take: limitInt,
            // 페이지당 가져올 항목 수
            select: {
              user_id: true,
              password: true,
              username: true,
              name: true,
              role: true,
              is_active: true,
              created_at: true,
              updated_at: true,
              hospital_name_id: true
            },
            orderBy: {
              user_id: "desc" // user_id를 기준으로 내림차순 정렬

            }
          }));

        case 10:
          users = _context2.sent;
          res.status(200).json({
            users: users,
            // 유저 데이터 반환
            totalPages: totalPages,
            // 전체 페이지 수
            currentPage: pageInt // 현재 페이지

          });
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](3);
          res.status(500).json({
            error: "유저 조회 중 오류가 발생했습니다.",
            details: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 14]]);
};

var updateUserController = function updateUserController(req, res) {
  var _req$body, user_id, name, role, is_active, hospital_name_id, updatedUser;

  return regeneratorRuntime.async(function updateUserController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, user_id = _req$body.user_id, name = _req$body.name, role = _req$body.role, is_active = _req$body.is_active, hospital_name_id = _req$body.hospital_name_id;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(updateUser(user_id, {
            name: name,
            role: role,
            is_active: is_active,
            hospital_name_id: hospital_name_id
          }));

        case 4:
          updatedUser = _context3.sent;
          res.json(updatedUser);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: "유저 정보 수정 중 오류가 발생했습니다.",
            details: _context3.t0.message
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // 로그인


var loginController = function loginController(req, res) {
  var _req$body2, username, password, user, isMatch, token;

  return regeneratorRuntime.async(function loginController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(getUserByUsername(username));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "사용자를 찾을 수 없습니다."
          }));

        case 7:
          isMatch = password === user.password;

          if (isMatch) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(401).json({
            error: "비밀번호가 일치하지 않습니다."
          }));

        case 10:
          token = jwt.sign({
            userId: user.user_id,
            role: user.role
          }, process.env.JWT_SECRET, // 환경변수에서 JWT 비밀키를 가져옵니다.
          {
            expiresIn: "12h"
          });
          res.json({
            message: "로그인 성공",
            token: token
          });
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            error: "로그인 처리 중 오류가 발생했습니다.",
            details: _context4.t0.message
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

module.exports = {
  createUserController: createUserController,
  getAllUsersController: getAllUsersController,
  updateUserController: updateUserController,
  loginController: loginController
};