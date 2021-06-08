const { Router } = require('express')
const { hashSync, compareSync } = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Account = require('../models/account')
const Token = require('../models/token')
const { Tracker } = require('../models/tracker')

const router = Router()

/* -------------------------------------------------------- Account Information Retrieval Endpoints */

// @route   GET account/
// @desc    Get a user's account information
// @access  Private
router.get('/', auth, async (req, res) => {
    await Account.findById(req.account_id, 'email_address username date_registered', (err, doc) => {
        if (err) {
            return res.status(500).json({ msg: err.message })
        } else if (doc) {
            return res.status(200).json({
                email_address: doc.email_address,
                username: doc.username,
                date_registered: doc.date_registered
            })
        } else {
            return res.sendStatus(404)
        }
    })
})

/* -------------------------------------------------------- Account Information Update Endpoints */

/* UPDATE EMAIL ENPOINT COMMENTED OUT BECAUSE I NO LONGER WANT USERS TO BE ABLE TO CHANGE THEIR ACCOUNT'S EMAIL ADDRESS */

// @route   PUT account/update/email
// @desc    Updates a user account's email
// @access  Private
router.put('/update/email', auth, async (req, res) => {
    const { new_email_address } = req.body

    // Checking that parameters are present
    if (!new_email_address) return res.status(400).json({ msg: 'New email address required' })

    // Checking that an account with that email doesnt already exist
    const account = await Account.findOne({ email_address: new_email_address })
    if (account) return res.status(400).json({ msg: 'Account with that email already exists' })

    await Account.findById(req.account_id, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Making changes
            doc.set({ email_address: new_email_address })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ new_email_address: new_email_address.toLowerCase() })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find account document for that account id' })
        }
    })
})

// @route   PUT account/update/username
// @desc    Updates a user account's username
// @access  Private
router.put('/update/username', auth, async (req, res) => {
    const { new_username } = req.body

    // Checking that parameters are present
    if (!new_username) return res.status(400).json({ msg: 'New username required' })

    await Account.findById(req.account_id, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Making changes
            doc.set({ username: new_username })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ new_username: new_username.toLowerCase() })
                }
            })
        } else {
            return res.sendStatus(404)
        }
    })
})

// @route   PUT account/update/password
// @desc    Updates a user account's password
// @access  Private
router.put('/update/password', auth, async (req, res) => {
    const { new_password } = req.body

    // Checking that parameters are present
    if (!new_password) return res.status(400).json({ msg: 'New password required' })

    // Making sure the password is valid
    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,256}$/.test(new_password))) {
        return res.status(400).json({ msg: 'New password must be atleast 8 characters and contain one of each: lowercase letter, uppercase letter, number, and symbol' })
    }

    let new_hashed_password

    try {
        // Encoding the password
        new_hashed_password = hashSync(new_password)
        if (!new_hashed_password) throw Error('Error hashing new password')
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }

    await Account.findById(req.account_id, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Making changes
            doc.set({ hashed_password: new_hashed_password })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.sendStatus(200)
                }
            })
        } else {
            return res.sendStatus(404)
        }
    })
})

/* -------------------------------------------------------- Account Logout Endpoints */

// @route   DELETE account/logout
// @desc    Removes the user's refresh token
// @access  Public
router.delete('/logout', auth, async (req, res) => {
    const refreshToken = req.signedCookies['refresh_token']

    // Checking that parameters are present
    if (!refreshToken) return res.sendStatus(401)

    // Deleting old refresh token
    await Token.findOneAndDelete({ token: refreshToken })

    // Removing the refresh token cookie
    res.clearCookie('refresh_token')
    return res.sendStatus(200)
})

// @route   DELETE account/logout_all
// @desc    Removes all the user's refresh tokens
// @access  Private
router.delete('/logout_all', auth, async (req, res) => {
    // Removing all refresh tokens associated with the user
    await Token.deleteMany({ account_id: req.account_id }, (err) => {
        if (err) {
            return res.status(500).json({ msg: err.message })
        } else {
            return res.sendStatus(200)
        }
    })
})

/* -------------------------------------------------------- Account Deletion Endpoints */

// @route   DELETE account/delete
// @desc    Deletes all the user's account information
// @access  Private
router.delete('/delete', auth, async (req, res) => {
    await Account.findByIdAndDelete(req.account_id, async (err, doc) => {
        if (err) {
            return res.status(500).json({ msg: err.message })
        } else if (doc) {
            // Deleting associated documents
            await Tracker.findOneAndDelete({ account_id: req.account_id })
            await Token.deleteMany({ account_id: req.account_id })

            return res.sendStatus(200)
        } else {
            return res.sendStatus(404)
        }
    })
})

module.exports = router