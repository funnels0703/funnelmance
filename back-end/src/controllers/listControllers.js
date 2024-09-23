const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 병원 정보 조회
async function getHospitals(req, res) {
    try {
        const hospitals = await prisma.hospital_name.findMany();
        res.json(hospitals);
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
    try {
        const events = await prisma.event_name.findMany();
        res.json(events);
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
    try {
        const advertisingCompanies = await prisma.advertising_company.findMany();
        res.json(advertisingCompanies);
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
};
