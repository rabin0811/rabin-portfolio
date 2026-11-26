const { rateLimit } = require('express-rate-limit')

const createLimiter = (windowMs, limit, message, skipSuccessfulRequests = false) => (
    rateLimit({
        windowMs,
        limit,
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        message: { message },
    })
)

const loginLimiter = createLimiter(
    15 * 60 * 1000,
    10,
    'Too many login attempts. Please try again later.',
    true
)

const registrationLimiter = createLimiter(
    60 * 60 * 1000,
    5,
    'Too many registration attempts. Please try again later.'
)

const forgotPasswordLimiter = createLimiter(
    60 * 60 * 1000,
    3,
    'Too many password reset requests. Please try again later.'
)

const resetPasswordLimiter = createLimiter(
    15 * 60 * 1000,
    10,
    'Too many password reset attempts. Please try again later.',
    true
)

const visitorLimiter = createLimiter(
    60 * 60 * 1000,
    1,
    'Visitor count limit reached. Try again later.'
)

module.exports = {
    forgotPasswordLimiter,
    loginLimiter,
    registrationLimiter,
    resetPasswordLimiter,
    visitorLimiter,
}
