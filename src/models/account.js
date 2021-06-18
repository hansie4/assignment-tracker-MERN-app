const mongoose = require('mongoose')

async function checkForDupicateEmailAddress(val) {
    const dupe = await Account.findOne({ _id: { $ne: this._id }, email_address: val })
    if (dupe) {
        return false
    } else {
        return true
    }
}

const emailValidator = [checkForDupicateEmailAddress, 'Account with that email already exists']

async function checkForDupicateUsername(val) {
    const dupe = await Account.findOne({ _id: { $ne: this._id }, username: val })
    if (dupe) {
        return false
    } else {
        return true
    }
}

const usernameValidator = [checkForDupicateUsername, 'Account with that username already exists']


const AccountSchema = new mongoose.Schema({
    email_address: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Email address required'],
        lowercase: true,
        match: [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/, 'Invalid email format'],
        validate: emailValidator
    },
    hashed_password: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Hashed password required']
    },
    username: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Username required'],
        lowercase: true,
        match: [/^[a-zA-Z0-9_]{6,64}$/, 'Username must be 6 to 64 characters long and can only contain characters: a-z, A-Z, 0-9, and _'],
        validate: usernameValidator
    },
    date_registered: {
        type: mongoose.Schema.Types.Date,
        required: true,
        default: Date.now
    },
    assignments_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const Account = mongoose.model('Account', AccountSchema)

module.exports = Account
