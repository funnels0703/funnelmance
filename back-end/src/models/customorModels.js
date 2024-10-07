// models/customorModels.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getFilteredCustomors = async (filters, offset = 0, limit = 10) => {
  const {
    advertising_company_ids,
    startDate,
    endDate,
    url_code,
    selected_hospital_id, // 병원 ID 필터 추가
  } = filters;

  const companyIds = advertising_company_ids
    ? advertising_company_ids
        .split(",")
        .map(Number)
        .filter((id) => id !== 0)
    : [];

  try {
    const urlCodeSettings = await prisma.url_code_setting.findMany({
      where: {
        AND: [
          {
            advertising_company_id: {
              in: companyIds.length > 0 ? companyIds : undefined,
            },
          },
          selected_hospital_id
            ? { hospital_name_id: selected_hospital_id }
            : {}, // 병원 ID 필터 적용
        ],
      },
      select: {
        id: true,
        ad_title: true,
        hospital_name_id: true,
        event_name_id: true,
        advertising_company_id: true,
      },
    });

    const urlCodeSettingIds = urlCodeSettings.map((setting) => setting.id);

    console.log(companyIds, urlCodeSettingIds);

    // 2. customor_db에서 url_code_setting_id로 필터링하여 데이터 조회
    const filteredCustomors = await prisma.customor_db.findMany({
      where: {
        data_status: 0,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        url_code_setting_id: {
          in: urlCodeSettingIds.length > 0 ? urlCodeSettingIds : undefined,
        },
        ...(url_code ? { url_code } : {}),
      },
      skip: offset,
      take: limit,
    });

    // hospital_name, event_name, advertising_company 이름을 가져오기
    const customorDataWithNames = await Promise.all(
      filteredCustomors.map(async (customor) => {
        const urlCodeSetting = urlCodeSettings.find(
          (setting) => setting.id === customor.url_code_setting_id
        );
        if (!urlCodeSetting) return customor;

        // hospital_name, event_name, advertising_company의 name 필드 조회
        const [hospital, event, company] = await Promise.all([
          prisma.hospital_name.findUnique({
            where: { id: urlCodeSetting.hospital_name_id },
            select: { name: true },
          }),
          prisma.event_name.findUnique({
            where: { id: urlCodeSetting.event_name_id },
            select: { name: true },
          }),
          prisma.advertising_company.findUnique({
            where: { id: urlCodeSetting.advertising_company_id },
            select: { name: true },
          }),
        ]);

        return {
          ...customor,
          hospital_name: hospital ? hospital.name : null,
          event_name: event ? event.name : null,
          advertising_company: company ? company.name : null,
          ad_title: urlCodeSetting.ad_title, // ad_title 추가
        };
      })
    );

    return customorDataWithNames;
  } catch (error) {
    console.error("Error fetching filtered customor data:", error);
    throw error;
  }
};

// 총 개수를 가져오는 함수
const getTotalCustomorCount = async (filters) => {
  const {
    advertising_company_ids,
    startDate,
    endDate,
    url_code,
    selected_hospital_id, // 병원 ID 필터 추가
  } = filters;
  const companyIds = advertising_company_ids
    ? advertising_company_ids.split(",").map(Number)
    : [];

  try {
    const urlCodeSettingIds = await getUrlCodeSettingIds(
      companyIds,
      selected_hospital_id
    );

    // 로그 추가
    console.log("Company IDs:", companyIds);
    console.log("Selected Hospital ID:", selected_hospital_id);
    console.log("URL Code Setting IDs:", urlCodeSettingIds);

    const count = await prisma.customor_db.count({
      where: {
        data_status: 0,
        date: {
          // 주석 처리된 날짜 필터
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        url_code_setting_id: {
          in: urlCodeSettingIds,
        },
        ...(url_code ? { url_code } : {}),
      },
    });

    // 로그 출력
    console.log("Total Count:", count);

    return count;
  } catch (error) {
    console.error("Error fetching total customor count:", error);
    throw error;
  }
};

// url_code_setting_ids를 가져오는 헬퍼 함수
const getUrlCodeSettingIds = async (companyIds, selected_hospital_id) => {
  const urlCodeSettings = await prisma.url_code_setting.findMany({
    where: {
      AND: [
        {
          advertising_company_id: {
            in: companyIds.length > 0 ? companyIds : undefined,
          },
        },
        selected_hospital_id ? { hospital_name_id: selected_hospital_id } : {}, // 병원 ID 필터 적용
      ],
    },
    select: {
      id: true,
    },
  });

  return urlCodeSettings.map((setting) => setting.id);
};

// 특정 ID의 customor 데이터 가져오기 (GET by ID)
const getCustomorById = async (id) => {
  return prisma.customor_db.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      dividend_status: true,
      date: true,
      name: true,
      phone: true,
      initial_status: true,
      no_answer_count: true,
      recall_request_at: true,
      reservation_date: true,
      visit_status: true,
      url_code: true,
      url_code_setting: {
        select: {
          hospital_name: true,
          advertising_company: true,
          ad_title: true,
        },
      },
    },
  });
};

// customor 데이터 생성 (POST)
const createCustomor = async (data) => {
  return prisma.customor_db.create({
    data: {
      name: data.name,
      phone: data.phone,
      url_code: data.url_code,
      dividend_status: data.dividend_status || null,
      date: data.date || null,
      initial_status: data.initial_status || null,
      no_answer_count: data.no_answer_count || 0,
      recall_request_at: data.recall_request_at || null,
      reservation_date: data.reservation_date || null,
      visit_status: data.visit_status || null,
    },
  });
};

// 특정 ID의 customor 데이터 업데이트 (PUT)
const updateCustomor = async (id, data) => {
  return prisma.customor_db.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      phone: data.phone,
      url_code: data.url_code,
      dividend_status: data.dividend_status || null,
      date: data.date ? new Date(data.date) : null,
      initial_status: data.initial_status || null,
      no_answer_count: data.no_answer_count || 0,
      recall_request_at: data.recall_request_at
        ? new Date(data.recall_request_at)
        : null,
      reservation_date: data.reservation_date
        ? new Date(data.reservation_date)
        : null,
      visit_status: data.visit_status || null,
    },
  });
};

//복원도 구현해야해서 data_status 받아오는걸로 구현해야함
const updateDataStatusModel = async (ids, data_status) => {
  return prisma.customor_db.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      data_status: data_status,
    },
  });
};

const deleteCustomors = async (ids) => {
  return await prisma.customor.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};

// url_code_setting의 최신 5개 데이터 가져오기
const getRecentUrlCodeSettings = async () => {
  return await prisma.url_code_setting.findMany({
    take: 8,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      ad_title: true,
    },
  });
};
// customor_db에서 특정 url_code_setting_id에 대한 데이터 수 카운트
const countCustomorBySettingId = async (settingId) => {
  return await prisma.customor_db.count({
    where: {
      url_code_setting_id: settingId,
    },
  });
};

module.exports = {
  // getAllCustomors,
  getFilteredCustomors,
  getTotalCustomorCount,
  getCustomorById,
  createCustomor,
  updateCustomor,
  updateDataStatusModel,
  deleteCustomors,
  // 매체별 갯수
  getRecentUrlCodeSettings,
  countCustomorBySettingId,
};
