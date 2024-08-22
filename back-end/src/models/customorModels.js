// models/customorModels.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 모든 customor 데이터를 가져오기 (GET)
const getAllCustomors = async (dataStatus) => {
  const queryOptions = {
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
          advertising_company: true,
          ad_title: true,
        },
      },
    },
  };

  if (dataStatus) {
    queryOptions.where = { data_status: parseInt(dataStatus) }; // `data_status` 필터 추가
  }

  return prisma.customor_db.findMany(queryOptions);
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
module.exports = {
  getAllCustomors,
  getCustomorById,
  createCustomor,
  updateCustomor,
  updateDataStatusModel,
  deleteCustomors,
};
