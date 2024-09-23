const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 병원 정보 조회
async function getHospitals(req, res) {
    const { page = 1, limit = 10 } = req.query; // 클라이언트에서 페이지 번호와 제한값을 받음
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    try {
        const totalItems = await prisma.hospital_name.count(); // 전체 항목 수 계산
        const totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산

        const hospitals = await prisma.hospital_name.findMany({
            skip: (pageInt - 1) * limitInt, // 페이지네이션 적용: 건너뛸 항목 수
            take: limitInt, // 페이지당 가져올 항목 수
        });

        res.json({
            items: hospitals,
            totalPages, // 전체 페이지 수 반환
            currentPage: pageInt, // 현재 페이지 반환
        });
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 병원 추가
async function addHospital(req, res) {
    const { name, status, hospital_code } = req.body;
    if (!name) {
        return res.status(400).send('병원 이름은 필수입니다.');
    }
    try {
        const newHospital = await prisma.hospital_name.create({
            data: { name, status, hospital_code },
        });
        res.status(201).json(newHospital);
    } catch (error) {
        console.error('Error adding hospital:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 이벤트 정보 조회
async function getEvents(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    try {
        const totalItems = await prisma.event_name.count(); // 전체 항목 수 계산
        const totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산

        const events = await prisma.event_name.findMany({
            skip: (pageInt - 1) * limitInt,
            take: limitInt,
        });

        res.json({
            items: events,
            totalPages, // 전체 페이지 수 반환
            currentPage: pageInt, // 현재 페이지 반환
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 이벤트 추가
async function addEvent(req, res) {
    const { name, status } = req.body;
    if (!name) {
        return res.status(400).send('이벤트 이름은 필수입니다.');
    }
    try {
        const newEvent = await prisma.event_name.create({
            data: { name, status },
        });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 매체 정보 조회
async function getAdvertisingCompanies(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    try {
        const totalItems = await prisma.advertising_company.count(); // 전체 항목 수 계산
        const totalPages = Math.ceil(totalItems / limitInt); // 전체 페이지 수 계산

        const advertisingCompanies = await prisma.advertising_company.findMany({
            skip: (pageInt - 1) * limitInt,
            take: limitInt,
        });

        res.json({
            items: advertisingCompanies,
            totalPages, // 전체 페이지 수 반환
            currentPage: pageInt, // 현재 페이지 반환
        });
    } catch (error) {
        console.error('Error fetching advertising companies:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 매체 추가
async function addAdvertisingCompany(req, res) {
    const { name, status } = req.body;
    if (!name) {
        return res.status(400).send('매체 이름은 필수입니다.');
    }
    try {
        const newAdvertisingCompany = await prisma.advertising_company.create({
            data: { name, status },
        });
        res.status(201).json(newAdvertisingCompany);
    } catch (error) {
        console.error('Error adding advertising company:', error);
        res.status(500).send('서버 오류입니다.');
    }
}

// 병원 정보 수정
async function updateHospital(req, res) {
    const { id } = req.params;
    const { hospital_code, manager, name, status } = req.body;
    console.log(id);

    try {
        const updatedHospital = await prisma.hospital_name.update({
            where: { id: parseInt(id) },
            data: { hospital_code, manager, name, status },
        });
        res.json(updatedHospital);
    } catch (error) {
        console.error('Error updating hospital:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('병원을 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

// 이벤트 정보 수정
async function updateEvent(req, res) {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const updatedEvent = await prisma.event_name.update({
            where: { id: parseInt(id) },
            data: { name, status },
        });
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('이벤트를 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

// 매체 정보 수정
async function updateAdvertisingCompany(req, res) {
    const { id } = req.params;
    const { name, status } = req.body;
    try {
        const updatedAdvertisingCompany = await prisma.advertising_company.update({
            where: { id: parseInt(id) },
            data: { name, status },
        });
        res.json(updatedAdvertisingCompany);
    } catch (error) {
        console.error('Error updating advertising company:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('매체를 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

// 병원 삭제
async function deleteHospital(req, res) {
    const { id } = req.params;
    try {
        const deletedHospital = await prisma.hospital_name.delete({
            where: { id: parseInt(id) },
        });
        res.json(deletedHospital);
    } catch (error) {
        console.error('Error deleting hospital:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('병원을 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

// 이벤트 삭제
async function deleteEvent(req, res) {
    const { id } = req.params;
    try {
        const deletedEvent = await prisma.event_name.delete({
            where: { id: parseInt(id) },
        });
        res.json(deletedEvent);
    } catch (error) {
        console.error('Error deleting event:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('이벤트를 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

// 매체 삭제
async function deleteAdvertisingCompany(req, res) {
    const { id } = req.params;
    try {
        const deletedAdvertisingCompany = await prisma.advertising_company.delete({
            where: { id: parseInt(id) },
        });
        res.json(deletedAdvertisingCompany);
    } catch (error) {
        console.error('Error deleting advertising company:', error);
        if (error.code === 'P2025') {
            return res.status(404).send('매체를 찾을 수 없습니다.');
        }
        res.status(500).send('서버 오류입니다.');
    }
}

module.exports = {
    getHospitals,
    addHospital,
    updateHospital,
    getEvents,
    addEvent,
    updateEvent,
    getAdvertisingCompanies,
    addAdvertisingCompany,
    updateAdvertisingCompany,
    deleteHospital,
    deleteEvent,
    deleteAdvertisingCompany,
};
