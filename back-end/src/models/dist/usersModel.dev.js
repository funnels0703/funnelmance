"use strict";

// src/models/userModel.js
var _require = require("@prisma/client"),
    PrismaClient = _require.PrismaClient;

var bcrypt = require("bcrypt");

var prisma = new PrismaClient();

var createUser = function createUser(userData) {
  var username, password, name, _userData$role, role, _userData$is_active, is_active;

  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = userData.username, password = userData.password, name = userData.name, _userData$role = userData.role, role = _userData$role === void 0 ? "USER" : _userData$role, _userData$is_active = userData.is_active, is_active = _userData$is_active === void 0 ? true : _userData$is_active;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(prisma.user.create({
            data: {
              username: username,
              password: password,
              name: name,
              role: role,
              is_active: is_active
            }
          }));

        case 4:
          return _context.abrupt("return", _context.sent);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error("유저 생성 중 오류 발생:", _context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

var getAllUsers = function getAllUsers() {
  return regeneratorRuntime.async(function getAllUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(prisma.user.findMany({
            select: {
              user_id: true,
              password: true,
              username: true,
              name: true,
              role: true,
              is_active: true,
              created_at: true,
              updated_at: true
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

var updateUser = function updateUser(user_id, data) {
  return regeneratorRuntime.async(function updateUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", prisma.user.update({
            where: {
              user_id: parseInt(user_id)
            },
            data: {
              name: data.name,
              role: data.role,
              is_active: Boolean(data.is_active)
            }
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getUserByUsername = function getUserByUsername(username) {
  var user;
  return regeneratorRuntime.async(function getUserByUsername$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(prisma.user.findUnique({
            where: {
              username: username
            }
          }));

        case 3:
          user = _context4.sent;
          return _context4.abrupt("return", user);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("사용자 조회 중 오류 발생:", _context4.t0);
          throw _context4.t0;

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  createUser: createUser,
  getAllUsers: getAllUsers,
  updateUser: updateUser,
  getUserByUsername: getUserByUsername
};