const { Router } = require('express')
const { hashSync, compareSync } = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const Account = require('../models/account')
const Token = require('../models/token')
const { Tracker } = require('../models/tracker')

const router = Router()

/* -------------------------------------------------------- Account Authentication Endpoints */

// @route   POST auth/login
// @desc    Login a user into their account
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    // Checking that parameters are present
    if (!username) return res.status(400).json({ msg: 'Username or email address required' })
    if (!password) return res.status(400).json({ msg: 'Password required' })

    await Account.findOne({ $or: [{ email_address: username.toLowerCase() }, { username: username.toLowerCase() }] }, (err, doc) => {
        if (err) {
            return res.status(500).json({ msg: err.message })
        } else if (doc) {
            // Checking that the password is correct
            const valid = compareSync(password, doc.hashed_password)
            if (!valid) return res.sendStatus(401)

            // Creating access token
            const accessToken = jsonwebtoken.sign({ _id: doc._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP) })
            if (!accessToken) throw Error('Error creating access token')

            // Creating refresh token
            const refreshToken = jsonwebtoken.sign({ _id: doc._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP) })
            if (!refreshToken) throw Error('Error creating refresh token')

            // Creating new token document
            const newTokenDocument = new Token({
                token: refreshToken,
                account_id: doc._id
            })

            // Saving the new token document
            const savedTokenDocument = newTokenDocument.save()
            if (!savedTokenDocument) throw Error('Error saving new refresh token')

            // Sending success response
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                signed: true,
                maxAge: (parseInt(process.env.REFRESH_TOKEN_EXP) * 1000),
                secure: (process.env.NODE_ENVIRONMENT === 'production')
            })
            return res.status(200).json({ access_token: accessToken })
        } else {
            return res.status(404).json({ msg: 'Account with those credentials not found' })
        }
    })
})

// @route   POST auth/register
// @desc    Registers a new user account
// @access  Public
router.post('/register', async (req, res) => {
    const { email_address, username, password } = req.body

    // Checking that parameters are present
    if (!email_address) return res.status(400).json({ msg: 'Missing email address' })
    if (!username) return res.status(400).json({ msg: 'Missing username' })
    if (!password) return res.status(400).json({ msg: 'Missing password' })

    // Making sure the password is valid
    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,256}$/.test(password))) {
        return res.status(400).json({ msg: 'Password must be atleast 8 characters and contain one of each: lowercase letter, uppercase letter, number, and symbol' })
    }

    try {
        // Encoding the password
        const hashed_password = hashSync(password)
        if (!hashed_password) throw Error('Error hashing password')

        // Creating new account document
        const newAccountDocument = new Account({
            email_address: email_address,
            username: username,
            hashed_password: hashed_password,
        })

        // Creating new assignments document
        const trackerDocument = new Tracker({
            account_id: newAccountDocument._id,
            semesters: []
        })

        newAccountDocument.assignments_id = trackerDocument._id

        // Creating access token
        const accessToken = jsonwebtoken.sign({ _id: newAccountDocument._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP) })
        if (!accessToken) throw Error('Error creating access token')

        // Creating refresh token
        const refreshToken = jsonwebtoken.sign({ _id: newAccountDocument._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP) })
        if (!refreshToken) throw Error('Error creating refresh token')

        // Creating new token document
        const newTokenDocument = new Token({
            token: refreshToken,
            account_id: newAccountDocument._id
        })

        // Saving the new account document
        await newAccountDocument.save()
            .then(async () => {
                // Saving the new tracker document
                const newTrackerDocument = await trackerDocument.save()
                if (!newTrackerDocument) throw Error('Error saving new tracker document')

                // Saving the new token document
                const savedTokenDocument = newTokenDocument.save()
                if (!savedTokenDocument) throw Error('Error saving new token document')

                // Sending success response
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    signed: true,
                    maxAge: (parseInt(process.env.REFRESH_TOKEN_EXP) * 1000),
                    secure: (process.env.NODE_ENVIRONMENT === 'production')
                })
                return res.status(201).json({ access_token: accessToken })
            })
            .catch((reason) => {
                return res.status(400).json({ msg: reason.message })
            })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   GET auth/refresh
// @desc    Refreshes a user's access token
// @access  Public
router.get('/refresh', async (req, res) => {
    const refreshToken = req.signedCookies['refresh_token']

    // Checking that parameters are present
    if (!refreshToken) return res.sendStatus(401)

    try {
        // Verifying the refresh token
        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)

        // Deleting old refresh token
        const deletedTokenDocument = await Token.findOneAndDelete({ token: refreshToken })
        if (!deletedTokenDocument) return res.sendStatus(401)

        // Creating new access token
        const accessToken = jsonwebtoken.sign({ _id: decoded._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP) })
        if (!accessToken) throw Error('Error creating access token')

        // Creating new refresh token
        const newRefreshToken = jsonwebtoken.sign({ _id: decoded._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXP) })
        if (!newRefreshToken) throw Error('Error creating refresh token')

        // Creating new token document
        const newTokenDocument = new Token({
            token: newRefreshToken,
            account_id: decoded._id
        })

        // Saving the new token document
        const savedTokenDocument = await newTokenDocument.save()
        if (!savedTokenDocument) throw Error('Error saving new token document')

        // Sending success response
        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            signed: true,
            maxAge: (parseInt(process.env.REFRESH_TOKEN_EXP) * 1000),
            secure: (process.env.NODE_ENVIRONMENT === 'production')
        })
        return res.status(200).json({ access_token: accessToken })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

/* -------------------------------------------------------- Account Recovery Endpoints */

// @route   POST auth/recover
// @desc    Sends a recovery link to the user's email address
// @access  Public
router.post('/recover', async (req, res) => {
    const { email_address } = req.body

    // Checking that parameters are present
    if (!email_address) return res.status(400).json({ msg: 'Email address for account required' })

    // Finding their account in the database
    const account = await Account.findOne({ email_address: email_address })
    if (!account) return res.sendStatus(404)

    // Removing all refresh tokens associated with the user
    await Token.deleteMany({ account_id: account._id })

    // Creating access token
    const accessToken = jsonwebtoken.sign({ _id: account._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXP) })
    if (!accessToken) throw Error('Error creating access token')

    // Send email with link to recover page with this token
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: account.email_address,
            subject: "Assignment Tracker Password Reset",
            text: "http://localhost:3000/recover/".concat(accessToken)
        })

        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

module.exports = router