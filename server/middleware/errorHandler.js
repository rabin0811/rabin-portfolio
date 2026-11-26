function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error)
    }

    console.error('Unhandled request error', error)

    const status = Number.isInteger(error.status)
        ? error.status
        : error.statusCode
    const isClientError = Number.isInteger(status) && status >= 400 && status < 500

    return res.status(isClientError ? status : 500).json({
        message: isClientError ? 'Invalid request' : 'Internal server error',
    })
}

module.exports = errorHandler
