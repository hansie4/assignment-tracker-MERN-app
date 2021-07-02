import { useState, useEffect } from "react"

import { connect } from "react-redux"

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

function ClassGradePanel({
    selectedClass
}) {

    const [gradeMatrix, setGradeMatrix] = useState(null)
    const [finalGrade, setFinalGrade] = useState(null)
    const [includeAll, setInclude] = useState(false)

    useEffect(() => {
        if (selectedClass) {
            setGradeMatrix(createGradeMatrix(selectedClass.assignment_types, selectedClass.assignments, includeAll))
        }
    }, [selectedClass, includeAll])

    useEffect(() => {
        if (gradeMatrix) {
            setFinalGrade(getFinalClassGrade(gradeMatrix).toFixed(2))
        }
    }, [gradeMatrix])

    if (selectedClass) {
        return (
            <Card className='border border-dark'>
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>{selectedClass.name} Grades:</Card.Title>
                        {
                            finalGrade ?
                                <h4 className='m-1'>
                                    <Badge
                                        variant={
                                            finalGrade >= 90 ?
                                                'success'
                                                :
                                                finalGrade >= 80 ?
                                                    'info'
                                                    :
                                                    finalGrade >= 70 ?
                                                        'warning'
                                                        :
                                                        'danger'
                                        }
                                    >
                                        {finalGrade}%
                                    </Badge>
                                </h4>
                                :
                                null
                        }

                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    {
                        gradeMatrix && gradeMatrix.length > 0 ?
                            <Table striped bordered hover size='sm' responsive className='m-0'>
                                <thead>
                                    <tr>
                                        <th colSpan={4}>Assignment Type</th>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <th>#</th>
                                        <th>Weight</th>
                                        <th>Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        gradeMatrix.map((gradeMatrix_row, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[0]
                                                        }
                                                    </th>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[1]
                                                        }
                                                    </th>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[2]
                                                        }%
                                                    </th>
                                                    <th>
                                                        {
                                                            (gradeMatrix_row[3] !== null) ? gradeMatrix_row[3].toFixed(2) + '%' : null
                                                        }
                                                    </th>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            :
                            null
                    }
                </Card.Body>
                <Card.Footer className='p-0'>
                    {
                        (gradeMatrix && finalGrade) ?
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    Total Assignments Counted: {gradeMatrix.reduce((total, currentRow) => (currentRow[1] + total), 0)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Overall Class Grade: {finalGrade}%
                                </ListGroup.Item>
                            </ListGroup>
                            :
                            null
                    }
                    <Button block onClick={() => setInclude(!includeAll)} className='m-0' variant='secondary'>
                        {
                            includeAll ?
                                'View Grade For Assignments Till Today'
                                :
                                'View Grade Counting All Assignments'
                        }
                    </Button>
                </Card.Footer>
            </Card>
        )
    } else {
        return (
            <div></div>
        )
    }

}

const createGradeMatrix = (assignment_types, assignments, includeAll) => {
    let matrix = []

    const assignmentMatrix = createAssignmentsMatrix(assignment_types, assignments)

    assignmentMatrix.forEach((currentAssignmentTypeRow) => {

        const assignmentTypeGrades = calculateAssignmentTypeGrade(currentAssignmentTypeRow[3], includeAll)

        matrix.push([
            currentAssignmentTypeRow[1], // Assignment Type Name
            assignmentTypeGrades[1], // Number of assignments being counted
            currentAssignmentTypeRow[2], // Assignment Type Weight
            assignmentTypeGrades[0]  // Grade for that assignment type
        ])
    })

    return matrix
}

const createAssignmentsMatrix = (assignment_types, assignments) => {
    let matrix = []

    assignment_types.forEach(assignment_type => {
        matrix.push([assignment_type._id, assignment_type.name, assignment_type.weight, []])
    })

    assignments.forEach(assignment => {
        let row = matrix.find(arr => arr[0] === assignment.assignment_type_id)
        if (row) {
            row[3].push([assignment.grade, assignment.due_date, assignment.turned_in])
        }
    })

    return matrix
}

const calculateAssignmentTypeGrade = (assignmentsArray, includeAll) => {
    let assignmentsCounted = 0
    let cumulativeGrade = 0
    let averageGrade

    assignmentsArray.forEach((currentAssignment) => {

        const currentDate = new Date().setHours(0, 0, 0, 0)
        const grade = currentAssignment[0]
        const dueDate = new Date(currentAssignment[1])
        const turnedIn = currentAssignment[2]

        if (includeAll) {
            assignmentsCounted++
            if (grade) {
                cumulativeGrade += grade
            }
        } else {
            if (turnedIn) {
                if (grade) {
                    assignmentsCounted++
                    cumulativeGrade += grade
                }
            } else {
                if (currentDate > dueDate) {
                    assignmentsCounted++
                }
            }
        }
    })

    if (assignmentsCounted > 0) {
        averageGrade = cumulativeGrade / assignmentsCounted
    } else {
        averageGrade = null
    }

    return [averageGrade, assignmentsCounted]
}

const getFinalClassGrade = (gradeMatrix) => {
    return gradeMatrix.reduce((finalGrade, currentRow) => {
        if (currentRow[3] !== null) {
            return finalGrade += ((currentRow[2] / 100) * currentRow[3])
        } else {
            return finalGrade += ((currentRow[2] / 100) * 100)
        }
    }, 0)
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClassGradePanel)