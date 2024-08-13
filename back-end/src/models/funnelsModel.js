const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 모든 항목 조회
async function getAllFunnels() {
    return await prisma.funnels_db.findMany();
}

// 새 항목 추가
async function createFunnels(data) {
    return await prisma.funnels_db.create({
        data: data,
    });
}

module.exports = {
    getAllFunnels,
    createFunnels,
};
