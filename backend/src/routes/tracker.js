const { Router } = require('express')
const auth = require('../middleware/auth')
const { Tracker, Semester, Class, Instructor, AssignmentType, Assignment } = require('../models/tracker')

const router = Router()

/* -------------------------------------------------------- Get All the User's Assignments Info Endpoint */

// @route   GET tracker/
// @desc    Returns all the user's semesters information
// @access  Private
router.get('/', auth, async (req, res) => {
    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Sending success response
            return res.status(200).json({ semesters: doc.semesters })
        } else {
            return res.status(404).json({ msg: 'Could not find tracker document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify Semesters Endpoint */

// @route   POST tracker/semester
// @desc    Adds a new semester
// @access  Private
router.post('/semester', auth, async (req, res) => {
    const { name, start_date, end_date } = req.body

    // Checking that required parameters are present
    if (!name) return res.status(400).json({ msg: 'Semester name is required' })
    if (start_date && !end_date) {
        return res.status(400).json({ msg: 'End date is required' })
    }
    if (!start_date && end_date) {
        return res.status(400).json({ msg: 'Start date is required' })
    }

    // Creating new semester document
    const newSemester = new Semester({
        name,
        start_date,
        end_date
    })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
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
                    return res.status(201).json({ semesters: doc.semesters })
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
    const semester_id = req.get('semester_id')

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
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
                    return res.status(200).json({ semesters: doc.semesters })
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
    const semester_id = req.get('semester_id')
    const { new_name, new_start_date, new_end_date, deleteDates } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!new_name && !new_start_date && !new_end_date && !deleteDates) return res.status(400).json({ msg: 'New value to update is required' })
    if (new_start_date && !new_end_date) {
        return res.status(400).json({ msg: 'End date is required' })
    }
    if (!new_start_date && new_end_date) {
        return res.status(400).json({ msg: 'Start date is required' })
    }

    // Query
    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).set({ name: new_name })
            if (new_start_date) doc.semesters.id(semester_id).set({ start_date: new_start_date })
            if (new_end_date) doc.semesters.id(semester_id).set({ end_date: new_end_date })
            if (deleteDates) doc.semesters.id(semester_id).set({ start_date: null, end_date: null })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
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
    const semester_id = req.get('semester_id')
    const { name, description } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!name) return res.status(400).json({ msg: 'Class name is required' })

    // Creating new class document
    const newClass = new Class({
        name,
        description
    })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
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
                    return res.status(201).json({ semesters: doc.semesters })
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
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
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
                    return res.status(200).json({ semesters: doc.semesters })
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
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const { new_name, new_description } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!new_name && !new_description) return res.status(400).json({ msg: 'New value to update is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
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
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify Instructors Endpoint */

// @route   POST assignments/instructor
// @desc    Adds a new instructor
// @access  Private
router.post('/instructor', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const { name, email_address, office_hours_info } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!name) return res.status(400).json({ msg: 'Instructor name is required' })

    // Creating new instructor document
    const newInstructor = new Instructor({
        name,
        email_address,
        office_hours_info
    })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Adding the new class
            doc.semesters.id(semester_id).classes.id(class_id).instructors.push(newInstructor)

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(201).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   DELETE assignments/instructor
// @desc    Deletes an instructor
// @access  Private
router.delete('/instructor', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const instructor_id = req.get('instructor_id')

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!instructor_id) return res.status(400).json({ msg: 'Instructor id is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an instructor with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).instructors.id(instructor_id)) return res.status(404).json({ msg: 'Instructor with that id could not be found in class' })

            // Removing the class
            doc.semesters.id(semester_id).classes.id(class_id).instructors.pull({ _id: instructor_id })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   PUT assignments/instructor
// @desc    Modifys a instructor's info
// @access  Private
router.put('/instructor', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const instructor_id = req.get('instructor_id')
    const { new_name, new_email_address, new_office_hours_info } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!instructor_id) return res.status(400).json({ msg: 'Instructor id is required' })
    if (!new_name && !new_email_address && !new_office_hours_info) return res.status(400).json({ msg: 'New value to update is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an instructor with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).instructors.id(instructor_id)) return res.status(404).json({ msg: 'Instructor with that id could not be found in class' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).classes.id(class_id).instructors.id(instructor_id).set({ name: new_name })
            if (new_email_address) doc.semesters.id(semester_id).classes.id(class_id).instructors.id(instructor_id).set({ email_address: new_email_address })
            if (new_office_hours_info) doc.semesters.id(semester_id).classes.id(class_id).instructors.id(instructor_id).set({ office_hours_info: new_office_hours_info })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify AssignmentTypes Endpoint */

// @route   POST assignments/assignment_type
// @desc    Adds a new assignment_type
// @access  Private
router.post('/assignment_type', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const { name, weight } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!name) return res.status(400).json({ msg: 'AssignmentType name is required' })
    if (!weight) return res.status(400).json({ msg: 'AssignmentType weight is required' })

    // Creating new instructor document
    const newAssignmentType = new AssignmentType({
        name,
        weight
    })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Adding the new assignment type
            doc.semesters.id(semester_id).classes.id(class_id).assignment_types.push(newAssignmentType)

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(201).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   DELETE assignments/assignment_type
// @desc    Deletes an assignment_type
// @access  Private
router.delete('/assignment_type', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const assignment_type_id = req.get('assignment_type_id')

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!assignment_type_id) return res.status(400).json({ msg: 'Assignment_type id is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an assignment type with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).assignment_types.id(assignment_type_id)) return res.status(404).json({ msg: 'Assignment_type with that id could not be found in class' })

            // Checking if assignment is using the assignment type
            const assignmentUsingType = doc.semesters.id(semester_id).classes.id(class_id).assignments.find((value) => value.assignment_type_id == assignment_type_id)

            if (assignmentUsingType) {
                return res.status(400).json({ msg: 'Cannot remove assignment type while in use by assignment' })
            }

            // Removing the assignment type
            doc.semesters.id(semester_id).classes.id(class_id).assignment_types.pull({ _id: assignment_type_id })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   PUT assignments/assignment_type
// @desc    Modifys a assignment_type's info
// @access  Private
router.put('/assignment_type', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const assignment_type_id = req.get('assignment_type_id')
    const { new_name, new_weight } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!assignment_type_id) return res.status(400).json({ msg: 'Assignment_type id is required' })
    if (!new_name && !new_weight) return res.status(400).json({ msg: 'New value to update is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an assignment type with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).assignment_types.id(assignment_type_id)) return res.status(404).json({ msg: 'Assignment_type with that id could not be found in class' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).classes.id(class_id).assignment_types.id(assignment_type_id).set({ name: new_name })
            if (new_weight) doc.semesters.id(semester_id).classes.id(class_id).assignment_types.id(assignment_type_id).set({ weight: new_weight })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

/* -------------------------------------------------------- Add, Delete, and Modify Assignment Endpoint */

// @route   POST assignments/assignment
// @desc    Adds a new assignment
// @access  Private
router.post('/assignment', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const { name, notes, due_date, assignment_type_id, turned_in, grade } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!name) return res.status(400).json({ msg: 'Assignment name is required' })

    // Creating new instructor document
    const newAssignment = new Assignment({
        name,
        notes,
        due_date,
        assignment_type_id,
        turned_in: (grade ? true : turned_in),
        grade
    })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Adding the new assignment
            doc.semesters.id(semester_id).classes.id(class_id).assignments.push(newAssignment)

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(201).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   DELETE assignments/assignment
// @desc    Deletes an assignment
// @access  Private
router.delete('/assignment', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const assignment_id = req.get('assignment_id')

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!assignment_id) return res.status(400).json({ msg: 'Assignment id is required' })

    // Query
    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an assignment type with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id)) return res.status(404).json({ msg: 'Assignment with that id could not be found in class' })

            // Removing the class
            doc.semesters.id(semester_id).classes.id(class_id).assignments.pull({ _id: assignment_id })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

// @route   PUT assignments/assignment
// @desc    Modifys a assignment's info
// @access  Private
router.put('/assignment', auth, async (req, res) => {
    const semester_id = req.get('semester_id')
    const class_id = req.get('class_id')
    const assignment_id = req.get('assignment_id')
    const { new_name, new_notes, new_due_date, new_assignment_type_id, new_turned_in, new_grade } = req.body

    // Checking that parameters are present
    if (!semester_id) return res.status(400).json({ msg: 'Semester id is required' })
    if (!class_id) return res.status(400).json({ msg: 'Class id is required' })
    if (!assignment_id) return res.status(400).json({ msg: 'Assignment id is required' })
    if (!new_name && !new_notes && !new_due_date && !new_assignment_type_id && (new_turned_in === null) && !new_grade) return res.status(400).json({ msg: 'New value to update is required' })

    await Tracker.findOne({ account_id: req.account_id }, (err, doc) => {
        if (err) {
            return res.status(400).json({ msg: err.message })
        } else if (doc) {
            // Checking if a semester with that id exists for the account
            if (!doc.semesters.id(semester_id)) return res.status(404).json({ msg: 'Semester with that id could not be found' })

            // Checking if a class with that id exists for the semester
            if (!doc.semesters.id(semester_id).classes.id(class_id)) return res.status(404).json({ msg: 'Class with that id could not be found in semester' })

            // Checking if an assignment type with that id exists for the class
            if (!doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id)) return res.status(404).json({ msg: 'Assignment with that id could not be found in class' })

            // Making changes
            if (new_name) doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ name: new_name })
            if (new_notes) doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ notes: new_notes })
            if (new_due_date) doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ due_date: new_due_date })
            if (new_assignment_type_id) doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ assignment_type_id: new_assignment_type_id })
            if (new_turned_in !== null) {
                if (new_turned_in) {
                    doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ turned_in: new_turned_in })
                } else {
                    doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ turned_in: new_turned_in, grade: null })
                }
            }
            if (new_grade) doc.semesters.id(semester_id).classes.id(class_id).assignments.id(assignment_id).set({ grade: new_grade, turned_in: true })

            // Saving the changes
            doc.save((err) => {
                if (err) {
                    return res.status(400).json({ msg: err.message })
                } else {
                    return res.status(200).json({ semesters: doc.semesters })
                }
            })
        } else {
            return res.status(404).json({ msg: 'Could not find assignments document for that account id' })
        }
    })
})

module.exports = router