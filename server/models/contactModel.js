const prisma = require('../prismaClient')

const createContact = async (data) => {
  return await prisma.contact.create({
    data,
  })
}

module.exports = {
  createContact,
}