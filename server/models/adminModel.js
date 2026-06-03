const prisma = require('../db')

const findAdminByEmail = async (email) => {
    return prisma.admin.findUnique({ where: { email } })
}

const findAdminById = async (id) => {
    return prisma.admin.findUnique({ where: { id } })
}

const createAdmin = async (data) => {
    return prisma.admin.create({
        data: {
            email: data.email,
            googleId: data.googleId,
            name: data.name || null,
        },
    })
}

const countAdmins = async () => {
    return prisma.admin.count()
}

const updateAdmin = async (id, data) => {
    return prisma.admin.update({ where: { id }, data })
}

module.exports = {
    findAdminByEmail,
    findAdminById,
    createAdmin,
    countAdmins,
    updateAdmin,
}
