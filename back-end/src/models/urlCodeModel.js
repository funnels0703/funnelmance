// models/urlCodeModel.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// URL 코드 데이터 조회
const getCodes = async (pageInt, limitInt) => {
  const totalItems = await prisma.url_code_setting.count(); // 전체 레코드 수 계산
  const totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산

  // 페이지에 맞는 URL 코드 설정 데이터를 가져옴
  const codes = await prisma.url_code_setting.findMany({
    skip: (pageInt - 1) * limitInt, // 페이지 건너뛰기
    take: limitInt, // 페이지당 가져올 항목 수
    select: {
      id: true,
      user_id: true,
      url_code: true,
      db_request_count: true,
      db_click_count: true,
      created_at: true,
      updated_at: true,
      ad_title: true,
      ad_number: true,
      event_name_id: true,
      hospital_name_id: true,
      advertising_company_id: true,
    },
    orderBy: {
      created_at: "desc", // ID를 기준으로 내림차순 정렬
    },
  });

  // 병원 이름, 광고 회사 이름, 이벤트 이름을 가져오고 codes에 추가
  const codesWithDetails = await Promise.all(
    codes.map(async (code) => {
      const [hospital, advertisingCompany, eventName] = await Promise.all([
        code.hospital_name_id
          ? prisma.hospital_name.findUnique({
              where: { id: code.hospital_name_id },
              select: { name: true },
            })
          : null,
        code.advertising_company_id
          ? prisma.advertising_company.findUnique({
              where: { id: code.advertising_company_id },
              select: { name: true },
            })
          : null,
        code.event_name_id
          ? prisma.event_name.findUnique({
              where: { id: code.event_name_id },
              select: { name: true },
            })
          : null,
      ]);

      return {
        ...code,
        hospital_name: hospital?.name || null,
        advertising_company_name: advertisingCompany?.name || null,
        event_name: eventName?.name || null,
      };
    })
  );

  return { codesWithDetails, totalPages };
};

async function checkCodeUniqueness(url_code) {
  const existingCode = await prisma.url_code_setting.findUnique({
    where: {
      url_code,
    },
  });
  return !existingCode; // 고유하다면 true 반환
}

async function createUrlCode(newUrlCode) {
  return await prisma.url_code_setting.create({
    data: newUrlCode,
  });
}

async function updateUrlCode(id, updatedFields) {
  try {
    const updatedUrlCode = await prisma.url_code_setting.update({
      where: { id },
      data: { ...updatedFields }, // 새 URL 코드로 업데이트
    });
    return updatedUrlCode;
  } catch (error) {
    console.error("업데이트 실패:", error);
    return null; // 실패 시 null 반환
  }
}

async function deleteUrlCode(deleteId) {
  try {
    const deletedCode = await prisma.url_code_setting.delete({
      where: {
        id: deleteId, // deleteId로 해당 ID의 코드를 삭제
      },
    });

    return {
      success: true,
      message: "코드가 삭제되었습니다.",
      deletedCode, // 삭제된 코드 정보 반환
    };
  } catch (error) {
    console.error("삭제 오류:", error);
    return {
      success: false,
      message: "코드 삭제에 실패했습니다.",
      error: error.message, // 오류 메시지 반환
    };
  }
}

// 접속 처리
// URL 코드 데이터 조회
async function findCodeByUrlCode(urlCode) {
  return await prisma.url_code_setting.findUnique({
    where: {
      url_code: urlCode,
    },
    select: {
      url_code: true, // 필요한 경우, 이 필드도 포함
      ad_number: true, // ad_number 필드를 가져옴
      // 필요하다면 다른 필드도 추가할 수 있습니다
    },
  });
}

// // IP로 기존 클릭 기록 확인
// async function findClickByIpAndCode(urlCode, ip) {
//   return await prisma.click.findUnique({
//     where: {
//       url_code_ip: {
//         url_code: urlCode,
//         ip: ip,
//       },
//     },
//   });
// }

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
  try {
    return await prisma.click.create({
      data: {
        url_code: urlCode,
        ip: ip,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // 중복된 레코드에 대한 처리 (예: 업데이트하거나, 오류 메시지 반환)
      console.log("This record already exists.");
      return null;
    } else {
      throw error;
    }
  }
}

module.exports = {
  getCodes,
  checkCodeUniqueness,
  createUrlCode,
  updateUrlCode,
  deleteUrlCode,
  // 접속 처리
  findCodeByUrlCode,
  // findClickByIpAndCode,
  incrementClickCount,
  createClickRecord,
};
