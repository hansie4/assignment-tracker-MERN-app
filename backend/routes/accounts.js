const { Router } = require('express')
const { hashSync, compareSync } = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const auth = require('../middleware/auth')
const Account = require('../models/account')
const { Assignments } = require('../models/assignments')

const router = Router()

/* Account Register, Login, and Delete Endpoints */

// @route   POST accounts/register
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

        // Sending success response
        return res.status(200).json({ token: authToken, msg: 'Account successfully registered' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   POST accounts/register
// @desc    Registers a new user account
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    // Checking that parameters are present
    if (!username) return res.status(400).json({ msg: 'Username or email address required' })
    if (!password) return res.status(400).json({ msg: 'Password required' })

    try {
        // Deciding if using email or username to login and then checking if an account exists with it
        let account
        if (username.includes("@")) {
            account = await Account.findOne({ email_address: username })
            if (!account) return res.status(400).json({ msg: 'Account with that email address does not exist' })
        } else {
            account = await Account.findOne({ username: username })
            if (!account) return res.status(400).json({ msg: 'Account with that username does not exist' })
        }

        // Checking that the password is correct
        const valid = compareSync(password, account.hashed_password)
        if (!valid) return res.status(401).json({ msg: 'Invalid credentials' })

        // Creating authentication token
        const authToken = jsonwebtoken.sign({ _id: account._id }, process.env.JWT_SECRET, { expiresIn: 3600 })
        if (!authToken) throw Error('Error creating authentication token')

        // Sending success response
        return res.status(200).json({ token: authToken, msg: 'Login successful' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   DELETE accounts/delete
// @desc    Deletes a user account
// @access  Private
router.delete('/delete', auth, async (req, res) => {
    try {
        // Deleting account document
        const deletedAccount = await Account.findByIdAndDelete(req.account_id)
        if (!deletedAccount) return res.status(400).json({ msg: 'Account document with that account id could not be found' })

        // Deleting assignments document
        const deletedAssignments = await Assignments.findOneAndDelete({ account_id: req.account_id })
        if (!deletedAssignments) return res.status(400).json({ msg: 'Assignments document with that account id could not be found' })

        // Sending success response
        return res.status(200).json({ msg: 'Account successfully deleted' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

/* Account Information Update Endpoints */

// @route   PUT accounts/update/email
// @desc    Updates a user account's email
// @access  Private
router.put('/update/email', auth, async (req, res) => {
    const { new_email_address } = req.body

    // Checking that parameters are present
    if (!new_email_address) return res.status(400).json({ msg: 'New email address required' })

    try {
        // Updating the account document with the new information
        const updatedAccount = await Account.findByIdAndUpdate(req.account_id, { email_address: new_email_address }, { runValidators: true })
        if (!updatedAccount) return res.status(400).json({ msg: 'Account document with that account id could not be found' })

        // Sending success response
        return res.status(200).json({ msg: 'Email successfully updated' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   PUT accounts/update/username
// @desc    Updates a user account's username
// @access  Private
router.put('/update/username', auth, async (req, res) => {
    const { new_username } = req.body

    // Checking that parameters are present
    if (!new_username) return res.status(400).json({ msg: 'New username required' })

    try {
        // Updating the account document with the new information
        const updatedAccount = await Account.findByIdAndUpdate(req.account_id, { username: new_username }, { runValidators: true })
        if (!updatedAccount) return res.status(400).json({ msg: 'Account document with that account id could not be found' })

        // Sending success response
        return res.status(200).json({ msg: 'Username successfully updated' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

// @route   PUT accounts/update/password
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

        // Updating the account document with the new information
        const updatedAccount = await Account.findByIdAndUpdate(req.account_id, { hashed_password: new_hashed_password }, { runValidators: true })
        if (!updatedAccount) return res.status(400).json({ msg: 'Account document with that account id could not be found' })

        // Sending success response
        return res.status(200).json({ msg: 'Password successfully updated' })
    } catch (error) {
        return res.status(500).json({ msg: error.message })
    }
})

module.exports = router