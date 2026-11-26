const Contact = require('../models/contactModel')
const prisma = require('../db')
const sendInternalError = require('../utils/sendInternalError')

const sendMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {}
        const fields = { name, email, subject, message }

        if (Object.values(fields).some((value) => typeof value !== 'string' || !value.trim())) {
            return res.status(400).json({ message: 'Name, email, subject, and message are required' })
        }

        const normalized = Object.fromEntries(
            Object.entries(fields).map(([field, value]) => [field, value.trim()])
        )

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' })
        }

        const data = await Contact.createContact(normalized)
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data,
        })
    } catch (error) {
        sendInternalError(res, error, 'Failed to store contact message', 'Failed to send message')
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } })
        res.status(200).json(messages)
    } catch (error) {
        sendInternalError(res, error, 'Failed to fetch contact messages')
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params
        await prisma.contact.delete({ where: { id: Number(id) } })
        res.status(200).json({ success: true, message: 'Message deleted' })
    } catch (error) {
        sendInternalError(res, error, 'Failed to delete contact message')
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
        sendInternalError(res, error, 'Failed to update contact message')
    }
}

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage,
    markMessageRead,
}
