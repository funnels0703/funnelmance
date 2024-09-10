// src/models/noticeModel.js

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getNotices = async () => {
  // 총 공지사항 수를 계산하는 부분은 제거
  // 페이지네이션 관련 쿼리도 제거
  const notices = await prisma.notice_board.findMany({
    select: {
      id: true,
      title: true,
      created_at: true,
      type: true,
      author_id: true,
      user: {
        // 작성자 정보도 포함
        select: {
          username: true,
        },
      },
    },
  });

  return notices; // 모든 공지사항을 반환
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
