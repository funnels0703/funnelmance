// routes/urlCodeRoutes.js
const express = require("express");
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
} = require("../modules/listmodule");

const router = express.Router();

router.get("/hospitals", getHospitals);
router.post("/hospitals", addHospital);
router.put("/hospitals/:id", updateHospital); // 병원 정보 수정

router.get("/events", getEvents);
router.post("/events", addEvent);
router.put("/events/:id", updateEvent); // 이벤트 정보 수정

router.get("/advertising_companies", getAdvertisingCompanies);
router.post("/advertising_companies", addAdvertisingCompany);
router.put("/advertising_companies/:id", updateAdvertisingCompany); // 매체 정보 수정

module.exports = router;
