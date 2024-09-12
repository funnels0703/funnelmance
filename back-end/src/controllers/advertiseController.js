// controllers/advertiseController.js
const {
    getUserSettingsByUserId,
    getAllAdvertisingCompanies,
    updateAdvertisingDataSettings,
} = require('../models/advertiseModel');

// 광고 회사 ID를 업데이트하는 컨트롤러 함수
async function updateAdvertisingData(req, res) {
    const { userId } = req.params; // 유저 ID
    const { advertisingCompanyIds } = req.body; // 광고 회사 ID 배열 또는 문자열

    // 광고 회사 ID가 제공되지 않은 경우 처리
    if (!advertisingCompanyIds) {
        return res.status(400).json({ message: '광고 회사 ID를 제공해야 합니다.' });
    }

    try {
        // 유저 설정 업데이트 함수 호출
        const updatedSettings = await updateAdvertisingDataSettings(parseInt(userId), advertisingCompanyIds);
        res.status(200).json({ message: '광고 회사 설정이 성공적으로 업데이트되었습니다.', data: updatedSettings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAdvertisingCompanies(req, res) {
    try {
        const companies = await getAllAdvertisingCompanies();
        res.status(200).json({ data: companies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 유저 설정 정보를 가져오는 컨트롤러 함수
async function getUserSettings(req, res) {
    const { userId } = req.params; // 요청에서 userId를 가져옴
    try {
        const userSettings = await getUserSettingsByUserId(userId);

        if (!userSettings) {
            return res.status(404).json({ message: '해당 유저의 설정 정보를 찾을 수 없습니다.' });
        }

        res.status(200).json({ data: userSettings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    updateAdvertisingData,
    getAdvertisingCompanies,
    getUserSettings,
};
