// src/models/userModel.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (userData) => {
    const { username, password, name, role, is_active = true, hospital_name_id } = userData;

    try {
        // 유저 생성
        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                name,
                role,
                is_active,
                hospital_name_id,
            },
        });

        // 유저가 생성된 후 해당 유저의 user_id를 이용해 user_settings 테이블에 추가
        await prisma.user_settings.create({
            data: {
                customer_data_settings: null, // customer_data_settings 컬럼에 NULL
                advertising_data_settings: '2000,2001,2002,2003', // advertising_data_settings 컬럼에 값 추가
                user: {
                    connect: { user_id: newUser.user_id }, // 새로 생성된 유저와 관계 설정
                },
            },
        });

        return newUser; // 생성된 유저 반환
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
            hospital_name_id: true,
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
            hospital_name_id: data.hospital_name_id,
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

const deleteUsers = async (userIds) => {
    try {
        // 여러 유저 삭제
        const deletedUsers = await prisma.user.deleteMany({
            where: {
                user_id: { in: userIds }, // 삭제할 유저들의 ID 배열
            },
        });

        return deletedUsers;
    } catch (error) {
        console.error('유저 삭제 중 오류 발생:', error);
        throw error;
    }
};
module.exports = {
    createUser,
    getAllUsers,
    updateUser,
    getUserByUsername,
    deleteUsers,
};
