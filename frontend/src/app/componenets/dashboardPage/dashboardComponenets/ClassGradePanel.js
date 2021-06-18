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
    const [includeOnlyGradedAssignments, setInclude] = useState(true)

    useEffect(() => {
        if (selectedClass) {
            setGradeMatrix(createWeightedGradeMatrix(selectedClass.assignment_types, selectedClass.assignments, includeOnlyGradedAssignments))
        }
    }, [selectedClass, includeOnlyGradedAssignments])

    useEffect(() => {
        if (gradeMatrix) {
            setFinalGrade(getFinalClassGrade(gradeMatrix).toFixed(1))
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
                        gradeMatrix ?
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
                                                            gradeMatrix_row[1]
                                                        }
                                                    </th>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[3]
                                                        }
                                                    </th>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[2]
                                                        }%
                                                    </th>
                                                    <th>
                                                        {
                                                            gradeMatrix_row[4] ? gradeMatrix_row[4].toFixed(1) + '%' : null
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
                                    Total Assignments: {gradeMatrix.reduce((total, currentRow) => (currentRow[3] + total), 0)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Overall Class Grade: {finalGrade}%
                                </ListGroup.Item>
                            </ListGroup>
                            :
                            null
                    }
                    <Button block onClick={() => setInclude(!includeOnlyGradedAssignments)} className='m-0' variant='secondary'>
                        {
                            includeOnlyGradedAssignments ?
                                'View All Assignments'
                                :
                                'View Only Graded Assignments'
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

const createGradeMatrix = (assignment_types, assignments) => {
    let matrix = []
    assignment_types.forEach(assignment_type => {
        matrix.push([assignment_type._id, assignment_type.name, assignment_type.weight, []])
    })

    assignments.forEach(assignment => {
        let row = matrix.find(arr => arr[0] === assignment.assignment_type_id)
        row[3].push(assignment.grade)
    })

    return matrix
}

const getAssignmentTypeAverage = (grades, includeOnlyGradedAssignments) => {
    let average
    const gradeSum = grades.reduce((total, currentGrade) => (currentGrade ? total + currentGrade : total), 0)
    let numberOfAssignments
    if (includeOnlyGradedAssignments) {
        numberOfAssignments = grades.reduce((total, currentAssignment) => (currentAssignment ? total + 1 : total), 0)

        if (numberOfAssignments > 0) {
            average = gradeSum / numberOfAssignments
        } else {
            average = null
        }
    } else {
        numberOfAssignments = grades.length

        if (numberOfAssignments > 0) {
            average = gradeSum / numberOfAssignments
        } else {
            average = null
        }
    }

    return average
}

const createWeightedGradeMatrix = (assignment_types, assignments, includeOnlyGradedAssignments) => {
    let weightedGradeMatrix = []

    const gradeMatrix = createGradeMatrix(assignment_types, assignments)

    gradeMatrix.forEach((row) => {
        if (includeOnlyGradedAssignments) {
            weightedGradeMatrix.push([row[0], row[1], row[2], row[3].reduce((total, currentAssignment) => (currentAssignment ? total + 1 : total), 0), getAssignmentTypeAverage(row[3], includeOnlyGradedAssignments)])
        } else {
            weightedGradeMatrix.push([row[0], row[1], row[2], row[3].length, getAssignmentTypeAverage(row[3], includeOnlyGradedAssignments)])
        }
    })

    return weightedGradeMatrix
}

const getFinalClassGrade = (weightedGradeMatrix) => {
    let final = weightedGradeMatrix.reduce((average, currentRow) => (currentRow[4] ? (((currentRow[2] / 100) * currentRow[4]) + average) : average), 0)

    return final
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClassGradePanel)