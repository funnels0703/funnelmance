// models/urlCodeModel.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkCodeUniqueness(url_code) {
  const existingCode = await prisma.url_code_setting.findUnique({
    where: {
      url_code,
    },
  });
  return !existingCode; // 고유하다면 true 반환
}

async function createUrlCode(data) {
  return await prisma.url_code_setting.create({
    data,
  });
}

// 접속 처리
// URL 코드 데이터 조회
async function findCodeByUrlCode(urlCode) {
  return await prisma.url_code_setting.findUnique({
    where: {
      url_code: urlCode,
    },
  });
}

// IP로 기존 클릭 기록 확인
async function findClickByIpAndCode(urlCode, ip) {
  return await prisma.click.findUnique({
    where: {
      url_code_ip: {
        url_code: urlCode,
        ip: ip,
      },
    },
  });
}

// 클릭 카운트 증가
async function incrementClickCount(urlCode) {
  return await prisma.url_code_setting.update({
    where: {
      url_code: urlCode,
    },
    data: {
      db_click_count: {
        increment: 1,
      },
    },
  });
}

// 새로운 클릭 기록 추가
async function createClickRecord(urlCode, ip) {
  return await prisma.click.create({
    data: {
      url_code: urlCode,
      ip: ip,
    },
  });
}
module.exports = {
  checkCodeUniqueness,
  createUrlCode,
  // 접속 처리
  findCodeByUrlCode,
  findClickByIpAndCode,
  incrementClickCount,
  createClickRecord,
};
