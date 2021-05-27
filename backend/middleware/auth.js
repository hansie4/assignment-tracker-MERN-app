const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next) {
    try {
        const authHeader = req.header('Authorization')

        const accessToken = authHeader.split(' ')[1]

        // Check for token
        if (!accessToken) return res.sendStatus(401)

        // Verify token
        const decoded = jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)

        // Add decoded account id
        req.account_id = decoded._id

        next()
    } catch (error) {
        return res.sendStatus(401)
    }
}

module.exports = auth