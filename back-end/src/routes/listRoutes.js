// routes/urlCodeRoutes.js
const express = require('express');
const {
    getHospitals,
    addHospital,
    getEvents,
    addEvent,
    getAdvertisingCompanies,
    addAdvertisingCompany,
    updateHospital,
    updateEvent,
    updateAdvertisingCompany,
    deleteHospital,
    deleteEvent,
    deleteAdvertisingCompany,
} = require('../controllers/listControllers');

const router = express.Router();

router.get('/hospitals', getHospitals);
router.post('/hospitals', addHospital);
router.put('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

router.get('/events', getEvents);
router.post('/events', addEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

router.get('/advertising_companies', getAdvertisingCompanies);
router.post('/advertising_companies', addAdvertisingCompany);
router.put('/advertising_companies/:id', updateAdvertisingCompany);
router.delete('/advertising_companies/:id', deleteAdvertisingCompany);

module.exports = router;
