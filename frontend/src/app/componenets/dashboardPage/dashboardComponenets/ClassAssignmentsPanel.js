import { useState, useEffect } from "react"

import { connect } from "react-redux"

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

import { FileEarmarkText, Plus, Check, X, PencilSquare } from 'react-bootstrap-icons'

import EditAssignmentModal from './EditAssignmentModal'
import AddAssignmentModal from './AddAssignmentModal'

function ClassAssignmentsPanel({
    selectedClass
}) {

    const [assignmentMatrix, setAssignmentMatrix] = useState(null)

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [sortType, setSortType] = useState(1)

    const [assignmentToEdit, setAssignmentToEdit] = useState(null)

    useEffect(() => {
        setAddModal(false)
        setEditModal(false)
        setSortType(1)
        setAssignmentToEdit(null)
        if (selectedClass) {
            setAssignmentMatrix(sortByDueDate(createAssignmentMatrix(selectedClass.assignments)))
        }
    }, [selectedClass])

    useEffect(() => {
        if (sortType === 1) {
            setAssignmentMatrix((assignmentMatrix) => sortByDueDate(assignmentMatrix))
        } else if (sortType === 2) {
            setAssignmentMatrix((assignmentMatrix) => sortByTurnedIn(assignmentMatrix))
        } else if (sortType === 3) {
            setAssignmentMatrix((assignmentMatrix) => sortByAssignmentType(assignmentMatrix))
        } else {
            setSortType(1)
        }
    }, [sortType])

    return (
        <div>
            <AddAssignmentModal show={addModal} close={() => setAddModal(false)} assignment_types={selectedClass.assignment_types} />
            <EditAssignmentModal show={editModal} close={() => setEditModal(false)} assignment={assignmentToEdit} assignment_types={selectedClass.assignment_types} />
            <Card className='border border-dark'>
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>Assignments:</Card.Title>
                        <Button onClick={() => setAddModal(true)} className='m-0' variant='success'><Plus className='mb-1' /><FileEarmarkText className='mb-1' /></Button>
                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    <Table hover striped className='m-0' size='sm' responsive>
                        <thead>
                            <tr>
                                <th>
                                    <Button size='sm' variant={sortType === 1 ? 'primary' : 'outline-dark'}
                                        onClick={() => setSortType(1)}
                                    >
                                        Due Date
                                    </Button>
                                </th>
                                <th>
                                    <Button size='sm' variant={sortType === 2 ? 'primary' : 'outline-dark'}
                                        onClick={() => setSortType(2)}
                                    >
                                        Done/Grade?
                                    </Button>
                                </th>
                                <th>
                                    <Button size='sm' variant={sortType === 3 ? 'primary' : 'outline-dark'}
                                        onClick={() => setSortType(3)}
                                    >
                                        Assignment Type
                                    </Button>
                                </th>
                                <th>Name</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                assignmentMatrix ?
                                    assignmentMatrix.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <th className='p-0'>{formatDate(value[0])}</th>
                                                <th className='p-0'>
                                                    <h5>{value[1] ? <Badge variant="success"><Check className='mb-1 mt-1' /> {value[3] ? (value[3] + '%') : null}</Badge> : <Badge variant="danger"><X className='mb-1 mt-1' /></Badge>}</h5>
                                                </th>
                                                <th className='p-0'>
                                                    {
                                                        selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value[2]) ?
                                                            selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value[2]).name
                                                            :
                                                            null
                                                    }
                                                </th>
                                                <th className='p-0'>{value[4]}</th>
                                                <th className='p-0'>{value[5]}</th>
                                                <th className='p-0'><Button size='sm' className='m-0' variant='secondary' onClick={() => {
                                                    setEditModal(true)
                                                    setAssignmentToEdit(value)
                                                }} ><PencilSquare className='mb-1' /></Button></th>
                                            </tr>
                                        )
                                    })
                                    :
                                    null
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

const createAssignmentMatrix = (assignments) => {
    let matrix = []

    assignments.forEach((assignment) => {
        matrix.push([assignment.due_date, assignment.turned_in, assignment.assignment_type_id, assignment.grade, assignment.name, assignment.notes, assignment._id])
    })

    return matrix
}

const sortByDueDate = (assignmentMatrix) => {
    let sorted = assignmentMatrix.slice()

    sorted.sort((a, b) => {
        return (new Date(a[0]) - new Date(b[0]))
    })

    return sorted
}

const sortByTurnedIn = (assignmentMatrix) => {
    let sorted = assignmentMatrix.slice()

    sorted.sort((a, b) => {
        if (a[1] && b[1]) {
            if (a[3] && b[3]) {
                return (a[3] - b[3])
            } else if (a[3]) {
                return -1
            } else if (b[3]) {
                return 1
            } else {
                return 0
            }
        } else if (a[1]) {
            return -1
        } else if (b[1]) {
            return 1
        } else {
            return 0
        }
    })

    return sorted
}

const sortByAssignmentType = (assignmentMatrix) => {
    let sorted = assignmentMatrix.slice()

    sorted.sort((a, b) => {
        if (a[2] && b[2]) {
            if (a[2] === b[2]) {
                return 0
            } else if (a[2] > b[2]) {
                return 1
            } else {
                return -1
            }
        } else if (a[2]) {
            return 1
        } else if (b[2]) {
            return -1
        } else {
            return 0
        }
    })

    return sorted
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${month}-${day}-${year}`)
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClassAssignmentsPanel)