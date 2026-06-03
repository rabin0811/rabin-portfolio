const Contact = require('../models/contactModel')
const prisma = require('../db')

const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body
        const data = await Contact.createContact({ name, email, subject, message })
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.contact.delete({ where: { id: Number(id) } })
        res.status(200).json({ success: true, message: 'Message deleted' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const markMessageRead = async (req, res) => {
    try {
        const { id } = req.params
        const data = await prisma.contact.update({
            where: { id: Number(id) },
            data: { isRead: true },
        })
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage,
    markMessageRead,
}
