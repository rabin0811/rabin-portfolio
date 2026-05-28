const prisma = require('../prismaClient')

const findAdminByEmail = async (email) => {
    return await prisma.admin.findUnique({
        where: { email },
    })
}

const createAdmin = async (data) => {
    return await prisma.admin.create({
        data,
    })
}

module.exports = {
    findAdminByEmail,
    createAdmin,
}