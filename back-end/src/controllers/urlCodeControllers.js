// controllers/urlCodeController.js
const {
  getCodes,
  createUrlCode,
  findCodeByUrlCode,
  updateUrlCode,
  deleteUrlCode,

  //접속관련
  findClickByIpAndCode,
  incrementClickCount,
  createClickRecord,
  checkCodeUniqueness,
} = require("../models/urlCodeModel");

const getCodesController = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  try {
    // 모델에서 URL 코드 설정 데이터를 가져옴
    const { codesWithDetails, totalPages } = await getCodes(pageInt, limitInt);

    res.status(200).json({
      codesWithDetails, // 가져온 코드 데이터 반환
      totalPages, // 전체 페이지 수
      currentPage: pageInt, // 현재 페이지
    });
  } catch (error) {
    res.status(500).json({
      error: "코드 조회 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
};

const createUrlCodeController = async (req, res) => {
  const {
    ad_title,
    ad_number,
    hospital_name_id,
    event_name_id,
    advertising_company_id,
    url_code,
  } = req.body;
  user_id = 1;

  console.log("url_code", url_code);
  try {
    // 중복 확인
    const isUnique = await checkCodeUniqueness(url_code);

    if (isUnique) {
      // URL 코드 생성
      const newUrlCode = await createUrlCode({
        ad_title,
        ad_number,
        hospital_name_id,
        event_name_id,
        advertising_company_id,
        url_code,
        user_id,
      });
      res.status(201).json(newUrlCode);
      console.log("newUrlCode", newUrlCode);
    } else {
      return res.status(400).json({ error: "Code already exists" });
    }
  } catch (error) {
    console.error("Error creating URL code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCodesController = async (req, res) => {
  const { id } = req.params; // id는 req.params에서 가져옴
  const updatedFields = req.body; // 업데이트할 데이터는 req.body에서 가져옴

  try {
    const updatedUrlCode = await updateUrlCode(Number(id), updatedFields);
    console.log(updatedUrlCode);
    if (!updatedUrlCode) {
      return res.status(404).json({ message: "URL 코드가 존재하지 않습니다." });
    }
    res
      .status(200)
      .json({ message: "URL 코드가 성공적으로 업데이트 되었습니다." });
  } catch (error) {
    console.error("업데이트 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// URL 코드 삭제 컨트롤러
const deleteUrlCodeController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUrlCode = await deleteUrlCode(Number(id)); // MongoDB의 ID를 사용하여 삭제
    if (!deletedUrlCode) {
      return res.status(404).json({ message: "URL 코드가 존재하지 않습니다." });
    }
    res.status(200).json({ message: "URL 코드가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("삭제 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// URL 코드에 해당하는 데이터 가져오기 및 클릭 카운트 증가
async function getUrlCodeData(req, res) {
  const { urlCode } = req.params;
  // const clientIp = req.headers["x-forwarded-for"] || req.ip;

  try {
    // URL 코드가 유효한지 확인
    const codeData = await findCodeByUrlCode(urlCode);

    if (!codeData) {
      return res.status(404).json({ error: "Code not found" });
    }

    // IP 주소로 기존 클릭 기록 확인
    // const existingClick = await findClickByIpAndCode(urlCode, clientIp);

    // if (!existingClick) {
    // 클릭 카운트 증가
    // await incrementClickCount(urlCode);

    // 클릭 기록 추가
    // await createClickRecord(urlCode, clientIp);
    // }

    res.json(codeData);
  } catch (error) {
    console.error("Error fetching code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function postUrlCodeData(req, res) {
  const { urlCode } = req.params;
  const clientIp = req.headers["x-forwarded-for"] || req.ip;
  try {
    // 클릭 카운트 증가
    await incrementClickCount(urlCode);

    // 클릭 기록 추가
    await createClickRecord(urlCode, clientIp);

    res.status(200).json({
      message: "Click count incremented and record created successfully",
    });
  } catch (error) {
    console.error("Error processing click:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getCodesController,
  createUrlCodeController,
  deleteUrlCodeController,
  updateCodesController,
  // 접속처리
  getUrlCodeData,
  postUrlCodeData,
};
