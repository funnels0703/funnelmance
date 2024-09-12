// routes/advertiseRoute.js
const express = require('express');
const {
    updateAdvertisingData,
    getAdvertisingCompanies,
    getUserSettings,
} = require('../controllers/advertiseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 광고 회사 ID를 업데이트하는 라우트
router.put('/settings/:userId', updateAdvertisingData);
router.get('/settings/:userId', getUserSettings);

router.get('/', getAdvertisingCompanies);

module.exports = router;
