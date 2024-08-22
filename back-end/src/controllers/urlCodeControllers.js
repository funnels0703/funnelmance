// controllers/urlCodeController.js
const {
  findCodeByUrlCode,
  findClickByIpAndCode,
  incrementClickCount,
  createClickRecord,
  checkCodeUniqueness,
  createUrlCode,
} = require("../models/urlCodeModel");

const createUrlCodeController = async (req, res) => {
  const { ad_title, ad_number, hospital_name, advertising_company, url_code } =
    req.body;
  user_id = 1;

  console.log(url_code);
  try {
    // 중복 확인
    const isUnique = await checkCodeUniqueness(url_code);
    if (!isUnique) {
      return res.status(400).json({ error: "Code already exists" });
    }

    // URL 코드 생성
    const newUrlCode = await createUrlCode({
      ad_title,
      ad_number,
      hospital_name,
      advertising_company,
      url_code,
      user_id,
    });
    res.status(201).json(newUrlCode);
  } catch (error) {
    console.error("Error creating URL code:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  createUrlCodeController,
  // 접속처리
  getUrlCodeData,
  postUrlCodeData,
};
