const sendInternalError = (res, error, context, message = 'Internal server error') => {
    console.error(context, error)

    if (res.headersSent) {
        return
    }

    return res.status(500).json({ message })
}

module.exports = sendInternalError
