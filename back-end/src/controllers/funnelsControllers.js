const { getAllFunnels, createFunnels } = require('../models/funnelsModel');

// 모든 항목을 가져오는 GET 요청 처리
async function getFunnels(req, res) {
    try {
        const funnels = await getAllFunnels();
        res.status(200).json(funnels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 새 항목을 추가하는 POST 요청 처리
async function postFunnels(req, res) {
    try {
        const newFunnels = await createFunnels(req.body);
        res.status(201).json(newFunnels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getFunnels,
    postFunnels,
};
