const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

/* ----------------------------------DEV---------------------------------- */
// Load Environmental Variables
const result = dotenv.config({ path: 'configs.env' })
if (result.error) {
    throw result.error
}

function auth(req, res, next) {

    const token = req.header('auth-token')

    // Check for token
    if (!token) return res.status(401).json({ msg: 'No authentication token, authorization denied' })

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Add decoded account id
        req.account_id = decoded

        next()
    } catch (error) {
        res.status(401).json({ msg: 'Token is invalid, authorization denied' })
    }
}

module.exports = auth