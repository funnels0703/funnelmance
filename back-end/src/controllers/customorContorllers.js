// controllers/customorControllers.js
const {
  getAllCustomors,
  getCustomorById,
  createCustomor,
  updateCustomor,
  updateDataStatusModel,
  deleteCustomors,
} = require("../models/customorModels");

// GET 요청: 모든 customor 데이터를 가져오기
const fetchCustomorData = async (req, res) => {
  try {
    const { data_status } = req.query; // 쿼리에서 data_status 파라미터 추출
    const customorData = await getAllCustomors(data_status);

    if (!customorData.length) {
      return res.status(404).json({ error: "데이터를 찾을 수 없습니다." });
    }

    res.json(customorData);
  } catch (error) {
    console.error("Error fetching customor data:", error);
    res.status(500).json({ error: "서버 오류입니다." });
  }
};

// GET 요청: 특정 ID의 customor 데이터를 가져오기
const fetchCustomorById = async (req, res) => {
  const { id } = req.params;

  try {
    const customorData = await getCustomorById(id);

    if (!customorData) {
      return res.status(404).json({ error: "해당 데이터를 찾을 수 없습니다." });
    }

    res.json(customorData);
  } catch (error) {
    console.error("Error fetching customor data by ID:", error);
    res.status(500).json({ error: "서버 오류입니다." });
  }
};

// POST 요청: 사용자 데이터 제출
const submitCustomorData = async (req, res) => {
  try {
    const { urlCode, name, phone } = req.body;

    // 기본값 설정 및 데이터 정제
    const customorData = {
      name: name || "",
      phone: phone || "",
      url_code: urlCode || "",
      dividend_status: null, // 추가 필드: 필요에 따라 기본값 설정
      date: null,
      initial_status: null,
      no_answer_count: 0,
      recall_request_at: null,
      reservation_date: null,
      visit_status: null,
      // 필요한 경우, 추가 필드를 여기에 포함
    };

    // 데이터베이스에 새 레코드 생성
    const newCustomor = await createCustomor(customorData);

    console.log(newCustomor);
    res.status(201).json(newCustomor);
  } catch (error) {
    console.error("Error submitting customor data:", error);
    res.status(500).json({ error: "서버 오류입니다." });
  }
};

// PUT 요청: 사용자 데이터 수정
const updateCustomorData = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCustomor = await updateCustomor(id, req.body);
    res.status(200).json(updatedCustomor);
  } catch (error) {
    console.error("Error updating customor data:", error);
    res.status(500).json({ error: "서버 오류입니다." });
  }
};

// 삭제 휴지통
const updateDataStatus = async (req, res) => {
  const { ids, data_status } = req.body;
  // console.log(ids);
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "업데이트할 ID를 제공해야 합니다." });
  }

  try {
    const updated = await updateDataStatusModel(ids, data_status);
    res.json({ message: `${updated.count}개의 데이터가 업데이트되었습니다.` });
  } catch (error) {
    console.error("Error updating data status:", error);
    res.status(500).json({ error: "데이터 업데이트 중 오류가 발생했습니다." });
  }
};

const handleDeleteCustomors = async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).send({ message: "No IDs provided for deletion." });
  }

  try {
    const result = await deleteCustomors(ids);
    return res.json({
      message: `${result.count} customors were deleted permanently.`,
    });
  } catch (error) {
    console.error("Failed to delete customors:", error);
    return res.status(500).send({ message: "Error deleting customors." });
  }
};
module.exports = {
  fetchCustomorData,
  fetchCustomorById,
  submitCustomorData,
  updateCustomorData,
  updateDataStatus,
  handleDeleteCustomors,
};
