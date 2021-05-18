const { Router } = require('express')
const { hashSync, compareSync } = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Account = require('../models/account')
const { Assignments, Semester, Class, Assignment } = require('../models/assignments')

const router = Router()

// @route   POST accounts/register
// @desc    Registers a new user account
// @access  Public
router.post('/register', async (req, res) => {
    const { email_address, username, password } = req.body

    if (!email_address) return res.status(400).json({ msg: 'Missing email address' })
    if (!username) return res.status(400).json({ msg: 'Missing username' })
    if (!password) return res.status(400).json({ msg: 'Missing password' })

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
        const assignmentsDocument = new Assignments({
            account_id: newAccountDocument._id,
            semesters: []
        })

        newAccountDocument.assignments_id = assignmentsDocument._id

        // Saving the new account
        const newAccount = await newAccountDocument.save()
        if (!newAccount) throw Error('Error saving new account document')

        // Saving the new assignments document
        const newAssignmentsDocument = await assignmentsDocument.save();
        if (!newAssignmentsDocument) throw Error('Error saving new assignments document')

        // Creating authentication token
        const authToken = jsonwebtoken.sign({ _id: newAccount._id }, process.env.JWT_SECRET, { expiresIn: 3600 })
        if (!authToken) throw Error('Error creating authentication token')

        return res.status(200).json({ token: authToken })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   POST accounts/register
// @desc    Registers a new user account
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username) return res.status(400).json({ msg: 'Username or email address required' })
    if (!password) return res.status(400).json({ msg: 'Password required' })

    try {
        let account
        if (username.includes("@")) {
            account = await Account.findOne({ email_address: username })
            if (!account) return res.status(400).json({ msg: 'Account with that email address does not exist' })
        } else {
            account = await Account.findOne({ username: username })
            if (!account) return res.status(400).json({ msg: 'Account with that username does not exist' })
        }

        const valid = compareSync(password, account.hashed_password)
        if (!valid) return res.status(401).json({ msg: 'Invalid credentials' })

        const authToken = jsonwebtoken.sign({ _id: account._id }, process.env.JWT_SECRET, { expiresIn: 3600 })
        if (!authToken) throw Error('Error creating authentication token')

        return res.status(200).json({ token: authToken })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   DELETE accounts/delete
// @desc    Deletes a user account
// @access  Private
router.delete('/delete', auth, async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.account_id)
        if (!deletedAccount) return res.status(400).json({ msg: 'Account document with that account id could not be found' })
        const deletedAssignments = await Assignments.findOneAndDelete({ account_id: req.account_id })
        if (!deletedAssignments) return res.status(400).json({ msg: 'Assignments document with that account id could not be found' })

        return res.status(200).json({ msg: 'Account successfully deleted' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

module.exports = router