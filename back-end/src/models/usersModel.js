// src/models/userModel.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (userData) => {
    const { username, password, name, role = 'USER', is_active = true } = userData;

    try {
        // 유저 생성
        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                name,
                role,
                is_active,
            },
        });

        // user_settings에 기본값 설정
        await prisma.user_settings.create({
            data: {
                user_id: newUser.user_id, // 새로 생성된 유저의 user_id
                advertising_data_settings: '2000,2001,2002,2003', // 기본 광고 회사 ID 설정
            },
        });

        return newUser;
    } catch (error) {
        console.error('유저 생성 중 오류 발생:', error);
        throw error;
    }
};

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            user_id: true,
            password: true,
            username: true,
            name: true,
            role: true,
            is_active: true,
            created_at: true,
            updated_at: true,
        },
    });
};

const updateUser = async (user_id, data) => {
    return prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: {
            name: data.name,
            role: data.role,
            is_active: Boolean(data.is_active),
        },
    });
};
const getUserByUsername = async (username) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        return user;
    } catch (error) {
        console.error('사용자 조회 중 오류 발생:', error);
        throw error;
    }
};

module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserByUsername,
};
