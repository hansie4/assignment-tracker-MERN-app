const mongoose = require('mongoose')

async function checkAccountId(val) {
    const dupe = await Assignments.findOne({ account_id: val })
    if (dupe) {
        return false
    } else {
        return true
    }
}

const accountIdValidator = [checkAccountId, 'Assignments document with that account id already exists']

const AssignmentTypeSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: [true, 'Assignment type name required'],
        minLength: [1, 'Assignment type name must be atleast 1 character long'],
        maxLength: [64, 'Assignment type name must be less than 65 characters long']
    },
    weight: {
        type: mongoose.Schema.Types.Number,
        require: [true, 'Assignment type weight required'],
        min: [0, 'Assignment type weight cannot be less than 0%'],
        max: [100, 'Assignment type weight cannot be more than 100%']
    }
})

const AssignmentSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: [true, 'Assignment name required'],
        minLength: [1, 'Assignment name must be atleast 1 character long'],
        maxLength: [64, 'Assignment name must be less than 65 characters long']
    },
    notes: {
        type: mongoose.Schema.Types.String,
        maxLength: [256, 'Assignment notes must be less than 257 characters long']
    },
    due_date: {
        type: mongoose.Schema.Types.Date,
    },
    assignment_type_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    turned_in: {
        type: mongoose.Schema.Types.Boolean,
        require: [true, 'Assignment turned in status required']
    },
    grade: {
        type: mongoose.Schema.Types.Number
    }
})

const InstructorSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: [true, 'Instructor name required'],
        minLength: [1, 'Instructor name must be atleast 1 character long'],
        maxLength: [64, 'Instructor name must be less than 65 characters long']
    },
    email_address: {
        type: mongoose.Schema.Types.String,
        minLength: [3, 'Instructor email address must be atleast 3 character long'],
        maxLength: [320, 'Instructor email address must be less than 321 characters long']
    },
    office_hours_info: {
        type: mongoose.Schema.Types.String,
        maxLength: [500, 'Instructor email address must be less than 501 characters long']
    }
})

const ClassSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: [true, 'Class name required'],
        minLength: [1, 'Class name must be atleast 1 character long'],
        maxLength: [64, 'Class name must be less than 65 characters long']
    },
    description: {
        type: mongoose.Schema.Types.String,
        maxLength: [500, 'Class name must be less than 501 characters long']
    },
    instructors: {
        type: [InstructorSchema]
    },
    assignment_types: {
        type: [AssignmentTypeSchema]
    },
    assignments: {
        type: [AssignmentSchema]
    }
})

const SemesterSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        require: [true, 'Semester name required'],
        minLength: [1, 'Semester name must be atleast 1 character long'],
        maxLength: [64, 'Semester name must be less than 65 characters long']
    },
    start_date: {
        type: mongoose.Schema.Types.Date
    },
    end_date: {
        type: mongoose.Schema.Types.Date
    },
    classes: {
        type: [ClassSchema]
    }
})

const AssignmentsSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, 'Missing id to account'],
        validate: accountIdValidator
    },
    semesters: {
        type: [SemesterSchema]
    }
})

const AssignmentType = mongoose.model('AssignmentType', AssignmentTypeSchema)
const Assignment = mongoose.model('Assignment', AssignmentSchema)
const Instructor = mongoose.model('Instructor', InstructorSchema)
const Class = mongoose.model('Class', ClassSchema)
const Semester = mongoose.model('Semester', SemesterSchema)
const Assignments = mongoose.model('User_Assignment', AssignmentsSchema)

module.exports = {
    AssignmentType,
    Assignment,
    Instructor,
    Class,
    Semester,
    Assignments
}