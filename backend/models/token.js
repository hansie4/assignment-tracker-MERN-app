const mongoose = require('mongoose')

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
        default: Date.now,
        expires: `${process.env.REFRESH_TOKEN_EXP}s`
    }
})

const Token = mongoose.model('Token', TokenSchema)

module.exports = Token
