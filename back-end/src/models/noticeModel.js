// src/models/noticeModel.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 공지사항 데이터 가져오기 (페이지네이션 적용)
const getNotices = async (
  page = 1,
  searchQuery = "",
  searchTypes = [], // 검색 타입 배열
  startDate = "",
  endDate = ""
) => {
  const PAGE_SIZE = 10;

  // NOTICE 공지사항 조회 조건
  const noticeWhereCondition = {
    type: "NOTICE",
    ...(searchQuery && {
      OR: searchTypes.map((type) => {
        if (type === "author") {
          return {
            user: {
              username: {
                contains: searchQuery, // 대소문자 구분 없음
              },
            },
          };
        }
        return {
          [type]: {
            contains: searchQuery, // 대소문자 구분 없음
          },
        };
      }),
    }),
  };

  // NOTICE 공지사항 조회
  const noticeNotices = await prisma.notice_board.findMany({
    where: noticeWhereCondition,
    select: {
      id: true,
      title: true,
      created_at: true,
      type: true,
      author_id: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // GENERAL 게시글 조회 조건
  const generalWhereCondition = {
    type: "GENERAL",
    ...(searchQuery && {
      OR: searchTypes.map((type) => {
        if (type === "author") {
          return {
            user: {
              username: {
                contains: searchQuery, // 대소문자 구분 없음
              },
            },
          };
        }
        return {
          [type]: {
            contains: searchQuery, // 대소문자 구분 없음
          },
        };
      }),
    }),
    ...(startDate &&
      endDate && {
        created_at: {
          gte: new Date(`${startDate}-01`), // 시작일
          lte: new Date(`${endDate}-01T23:59:59`), // 종료일
        },
      }),
  };

  // GENERAL 게시글의 총 개수
  const totalGeneralCount = await prisma.notice_board.count({
    where: generalWhereCondition,
  });

  // GENERAL 게시글 페이지네이션 적용된 결과
  const generalNotices = await prisma.notice_board.findMany({
    where: generalWhereCondition,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      created_at: true,
      type: true,
      author_id: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalGeneralCount / PAGE_SIZE);

  return {
    notices: {
      noticeNotices,
      generalNotices,
    },
    totalPages,
  };
};

const getNoticeById = async (id) => {
  return await prisma.notice_board.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

const createNotice = async (noticeData) => {
  const { title, content, type, author_id } = noticeData;
  console.log(noticeData);
  return await prisma.notice_board.create({
    data: { title, content, type, author_id },
  });
};

const updateNotice = async (id, data) => {
  return await prisma.notice_board.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title,
      content: data.content,
      type: data.type,
    },
  });
};

const deleteNotice = async (id) => {
  return await prisma.notice_board.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
