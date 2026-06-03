const prisma = require('../db')

const createContact = async (data) => {
    return prisma.contact.create({
        data: {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        },
    })
}

module.exports = {
    createContact,
}
