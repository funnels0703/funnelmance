// src/controllers/userController.js

const { getAllUsers, createUser, updateUser } = require('../models/usersModel');

const createUserController = async (req, res) => {
    try {
        console.log(1);
        const newUser = await createUser(req.body);
        console.log(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            error: '유저 생성 중 오류가 발생했습니다.',
            details: error.message,
        });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: '유저 조회 중 오류가 발생했습니다.',
            details: error.message,
        });
    }
};

const updateUserController = async (req, res) => {
    const { user_id, name, role, is_active } = req.body;
    try {
        const updatedUser = await updateUser(user_id, {
            name,
            role,
            is_active,
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            error: '유저 정보 수정 중 오류가 발생했습니다.',
            details: error.message,
        });
    }
};
module.exports = {
    createUserController,
    getAllUsersController,
    updateUserController,
};
