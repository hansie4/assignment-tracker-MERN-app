const mongoose = require('mongoose')

/* ----------------------------------DEV---------------------------------- */
// Load Environmental Variables
if (process.env.NODE_ENV === 'development') {
    const dotenv = require('dotenv')
    const environmentalVars = dotenv.config({ path: './configs.env' })
    if (environmentalVars.error) throw environmentalVars.error
}

const TokenSchema = new mongoose.Schema({
    token: {
        type: mongoose.Schema.Types.String,
        match: [/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, 'Refresh token does not match valid regex'],
        required: true
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        expires: parseInt(process.env.REFRESH_TOKEN_EXP),
        default: Date.now
    }
})

const Token = mongoose.model('Token', TokenSchema)

module.exports = Token
