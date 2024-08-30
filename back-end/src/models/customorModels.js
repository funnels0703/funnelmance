// models/customorModels.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 모든 customor 데이터를 가져오기 (GET)
// const getAllCustomors = async (dataStatus, page, limit) => {
//     const queryOptions = {
//         select: {
//             id: true,
//             dividend_status: true,
//             date: true,
//             name: true,
//             phone: true,
//             initial_status: true,
//             no_answer_count: true,
//             recall_request_at: true,
//             reservation_date: true,
//             visit_status: true,
//             url_code: true,
//             created_at: true,
//             data_status: true,
//             url_code_setting: {
//                 select: {
//                     hospital_name: true,
//                     advertising_company: true,
//                     ad_title: true,
//                 },
//             },
//         },
//         skip: (page - 1) * limit, // 페이지네이션을 위한 OFFSET
//         take: limit, // 페이지네이션을 위한 LIMIT
//     };

//     if (dataStatus) {
//         queryOptions.where = { data_status: parseInt(dataStatus) }; // `data_status` 필터 추가
//     }

//     const customorData = await prisma.customor_db.findMany(queryOptions);

//     const totalRecords = await prisma.customor_db.count({
//         where: dataStatus ? { data_status: parseInt(dataStatus) } : {}, // 전체 레코드 수를 계산
//     });

//     return [customorData, totalRecords];
// };
// 필터
const getFilteredCustomors = async (filters, offset = 0, limit = 10) => {
  const {
    dividend_status,
    hospital_name,
    event_name,
    advertising_company,
    ad_title,
    url_code,
    name,
    phone,
    date,
    data_status,
  } = filters;
  // console.log("date", date);
  // console.log("new date", new Date(date + "T00:00:00Z"));

  const queryOptions = {
    where: {
      AND: [
        data_status ? { data_status: parseInt(data_status) } : {},
        dividend_status ? { dividend_status } : {},
        phone ? { phone } : {},
        url_code ? { url_code } : {},
        date
          ? {
              date: {
                gte: new Date(date + "T00:00:00Z"), // 해당 날짜의 시작
                lt: new Date(
                  new Date(date + "T00:00:00Z").setDate(
                    new Date(date + "T00:00:00Z").getDate() + 1
                  )
                ), // 다음 날의 시작
              },
            }
          : {},
        name ? { name: { contains: name } } : {},
        {
          url_code_setting: {
            hospital_name: hospital_name
              ? { contains: hospital_name }
              : undefined,
            event_name: event_name ? { contains: event_name } : undefined,
            advertising_company: advertising_company
              ? { contains: advertising_company }
              : undefined,
            ad_title: ad_title ? { contains: ad_title } : undefined,
          },
        },
      ],
    },
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
      created_at: true,
      data_status: true,
      url_code_setting: {
        select: {
          hospital_name: true,
          event_name: true,
          advertising_company: true,
          ad_title: true,
        },
      },
    },
    skip: offset,
    take: limit,
  };

  return prisma.customor_db.findMany(queryOptions);
};

const getTotalCustomorCount = async (filters) => {
  const {
    dividend_status,
    hospital_name,
    advertising_company,
    ad_title,
    url_code,
    name,
    phone,
    date,
    data_status,
  } = filters;

  const countOptions = {
    where: {
      AND: [
        data_status ? { data_status: parseInt(data_status) } : {},
        dividend_status ? { dividend_status } : {},
        phone ? { phone } : {},
        url_code ? { url_code } : {},
        date
          ? {
              date: {
                gte: new Date(date + "T00:00:00Z"), // 날짜의 시작
                lt: new Date(
                  new Date(date + "T00:00:00Z").setDate(
                    new Date(date + "T00:00:00Z").getDate() + 1
                  )
                ), // 다음 날의 시작
              },
            }
          : {},
        name ? { name: { contains: name } } : {},
        {
          url_code_setting: {
            hospital_name: hospital_name
              ? { contains: hospital_name }
              : undefined,
            advertising_company: advertising_company
              ? { contains: advertising_company }
              : undefined,
            ad_title: ad_title ? { contains: ad_title } : undefined,
          },
        },
      ],
    },
  };

  return prisma.customor_db.count(countOptions);
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
    take: 5,
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
