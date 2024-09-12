// models/advertiseModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 유저 설정에 광고 회사 ID를 그대로 저장하는 함수
async function updateAdvertisingDataSettings(userId, advertisingCompanyIds) {
    try {
        // 데이터베이스 업데이트 - 광고 회사 ID를 그대로 저장
        const updatedUserSettings = await prisma.user_settings.update({
            where: { user_id: userId },
            data: { advertising_data_settings: advertisingCompanyIds }, // 가공 없이 그대로 저장
        });
        return updatedUserSettings;
    } catch (error) {
        throw new Error('광고 회사 ID 업데이트 중 오류 발생: ' + error.message);
    }
}

async function getAllAdvertisingCompanies() {
    try {
        const companies = await prisma.advertising_company.findMany({
            select: {
                id: true,
                name: true, // 회사 이름만 가져오도록 설정
            },
        });
        return companies;
    } catch (error) {
        throw new Error('광고 회사 목록 조회 중 오류 발생: ' + error.message);
    }
}
// 특정 유저의 설정 정보를 가져오는 함수
async function getUserSettingsByUserId(userId) {
    try {
        const userSettings = await prisma.user_settings.findUnique({
            where: { user_id: parseInt(userId) },
        });
        return userSettings;
    } catch (error) {
        throw new Error('유저 설정 정보를 가져오는 중 오류 발생: ' + error.message);
    }
}
module.exports = {
    updateAdvertisingDataSettings,
    getAllAdvertisingCompanies,
    getUserSettingsByUserId,
};
