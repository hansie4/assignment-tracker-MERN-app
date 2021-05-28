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
                date_registered: date_registered
            })
        } else {
            return res.sendStatus(404)
        }
    })
})

/* -------------------------------------------------------- Account Information Update Endpoints */

// @route   PUT account/update/email
// @desc    Updates a user account's email
// @access  Private
router.put('/update/email', auth, async (req, res) => {
    const { new_email_address } = req.body

    // Checking that parameters are present
    if (!new_email_address) return res.status(400).json({ msg: 'New email address required' })

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
                    return res.status(200).json({ new_email_address: new_email_address })
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
                    return res.status(200).json({ new_username: new_username })
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

    try {
        // Encoding the password
        const new_hashed_password = hashSync(new_password)
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