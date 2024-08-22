// routes/customor.js
const express = require('express');
const {
    // fetchCustomorData,
    submitCustomorData,
    updateCustomorData,
    updateDataStatus,
    handleDeleteCustomors,
    fetchFilteredCustomorData,
} = require('../controllers/customorContorllers');

const router = express.Router();

// router.get('/', fetchCustomorData);
router.post('/search', fetchFilteredCustomorData);
router.post('/', submitCustomorData);
router.delete('/delete', handleDeleteCustomors);

// 삭제 복원 기능
router.put('/update-status', updateDataStatus);
router.put('/:id', updateCustomorData);

module.exports = router;
