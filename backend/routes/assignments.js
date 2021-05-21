const { Router } = require('express')
const auth = require('../middleware/auth')
const { deleteOne } = require('../models/account')
const Account = require('../models/account')
const { Assignments, Semester, Class, Instructor, AssignmentType, Assignment } = require('../models/assignments')

const router = Router()

/* -------------------------------------------------------- Get All the User's Assignments Info Endpoint */

// @route   GET assignments/semesters
// @desc    Returns all the user's semesters information
// @access  Private
router.get('/', auth, async (req, res) => {
    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Sending success response
            return res.status(200).json({ msg: 'Semesters successfully retrieved', semesters: doc.semesters })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify Semesters Endpoint */

// @route   POST assignments/semester
// @desc    Adds a new semester
// @access  Private
router.post('/semester', auth, async (req, res) => {
    const { name, start_date, end_date } = req.body

    // Checking that required parameters are present
    if (!name) return res.status(400).json({ msg: 'Semester name is required' })

    // Creating new semester document
    const newSemester = new Semester({
        name,
        start_date,
        end_date
    })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Adding the new semester
            doc.semesters.push(newSemester)

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully added semester' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   DELETE assignments/semester
// @desc    Deletes a semester
// @access  Private
router.delete('/semester', auth, async (req, res) => {
    const { semester_id } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Removing the semester
            doc.semesters.pull({ _id: semester_id })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully deleted semester' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   PUT assignments/semester
// @desc    Modifys a semester's info
// @access  Private
router.put('/semester', auth, async (req, res) => {
    const { semester_id, new_name, new_start_date, new_end_date } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!new_name && !new_start_date && !new_end_date) return res.status(400).json({ msg: 'New value to update is required' })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).set({ name: new_name })
            if (new_start_date) doc.semesters.id(semester_id).set({ start_date: new_start_date })
            if (new_end_date) doc.semesters.id(semester_id).set({ end_date: new_end_date })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully updated semester' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify Classes Endpoint */

// @route   POST assignments/class
// @desc    Adds a new class
// @access  Private
router.post('/class', auth, async (req, res) => {
    const { semester_id, name, description } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!name) return res.status(400).json({ msg: 'Class name is required' })

    // Creating new class document
    const newClass = new Class({
        name,
        description
    })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Adding the new class
            doc.semesters.id(semester_id).classes.push(newClass)

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully added class' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   DELETE assignments/class
// @desc    Deletes a class
// @access  Private
router.delete('/class', auth, async (req, res) => {
    const { semester_id, class_id } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Removing the class
            doc.semesters.id(semester_id).classes.pull({ _id: class_id })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully deleted class' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   PUT assignments/class
// @desc    Modifys a class's info
// @access  Private
router.put('/class', auth, async (req, res) => {
    const { semester_id, class_id, new_name, new_description } = req.body

    // Checking that parameters are present
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!new_name || !new_start_date || !new_end_date) return res.status(400).json({ msg: 'New value to update is required' })

    // Query
    await Assignments.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).classes.id(class_id).set({ name: new_name })
            if (new_description) doc.semesters.id(semester_id).classes.id(class_id).set({ description: new_description })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ msg: 'Successfully updated class' })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

module.exports = router