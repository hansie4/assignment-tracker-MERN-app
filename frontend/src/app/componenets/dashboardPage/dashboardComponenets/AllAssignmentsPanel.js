import { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import Accordion from 'react-bootstrap/Accordion'

import { Plus, FileEarmarkText, Check, X, PencilSquare } from 'react-bootstrap-icons'

import AllAssignmentsAddModal from './AllAssignmentsAddModal'
import AllAssignmentsEditModal from './AllAssignmentsEditModal'

function ClassInfoPanel({
    selectedSemester
}) {

    const [assignmentsArrays, setAssignmentsArrays] = useState([[], [], [], [], [], []])

    const [selectedTab, setSelectedTab] = useState(null)

    const [addAssignmentModalShow, setAddAssignmentModalShow] = useState(false)
    const [editAssignmentModalShow, setEditAssignmentModalShow] = useState(false)

    const [selectedAssignmentToEdit, setSelectedAssignmentToEdit] = useState(null)

    useEffect(() => {
        setAssignmentsArrays(createAssignmentArrays(getAllAssignments(selectedSemester.classes)))
    }, [selectedSemester])

    if (selectedSemester) {
        return (
            <Card className='border border-dark'>
                <AllAssignmentsAddModal show={addAssignmentModalShow} close={() => setAddAssignmentModalShow(false)} />
                <AllAssignmentsEditModal show={editAssignmentModalShow} close={() => setEditAssignmentModalShow(false)} assignment={selectedAssignmentToEdit} />
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>{selectedSemester.name} Assignments:</Card.Title>
                        <Button onClick={() => setAddAssignmentModalShow(true)} className='m-0' variant='success'><Plus className='mb-1' /><FileEarmarkText className='mb-1' /></Button>
                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    <Accordion>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='0'
                                variant={selectedTab === 0 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 0) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(0)
                                    }
                                }}>
                                Past Due:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='0'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[0]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='1'
                                variant={selectedTab === 1 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 1) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(1)
                                    }
                                }}>
                                Due This Week:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='1'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[1]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='2'
                                variant={selectedTab === 2 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 2) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(2)
                                    }
                                }}>
                                Due This Month:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='2'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[2]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='3'
                                variant={selectedTab === 3 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 3) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(3)
                                    }
                                }}>
                                All Due Assignments:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='3'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[3]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='4'
                                variant={selectedTab === 4 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 4) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(4)
                                    }
                                }}>
                                All Completed Assignments:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='4'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[4]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Accordion.Toggle
                                as={Button}
                                eventKey='5'
                                variant={selectedTab === 5 ? 'dark' : 'secondary'}
                                onClick={() => {
                                    if (selectedTab === 5) {
                                        setSelectedTab(null)
                                    } else {
                                        setSelectedTab(5)
                                    }
                                }}>
                                All Assignments:
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey='5'>
                                <AssignmentsTable assignmentsArray={assignmentsArrays[5]} setSelectedAssignmentToEdit={setSelectedAssignmentToEdit} setEditAssignmentModalShow={setEditAssignmentModalShow} />
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <div></div>
        )
    }
}

function AssignmentsTable({ assignmentsArray, setSelectedAssignmentToEdit, setEditAssignmentModalShow }) {
    return (
        <Table hover striped className='m-0' size='sm' responsive>
            <thead>
                <tr>
                    <th>Due Date</th>
                    <th>Turned In/Grade</th>
                    <th>Class</th>
                    <th>Assignment Name</th>
                    <th>Assignment Type</th>
                    <th>Notes</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    assignmentsArray.map((assignment, index) => {
                        return (
                            <tr key={index}>
                                <th className='p-0'>{formatDate(assignment[5])}</th>
                                <th className='p-0'>
                                    <h5>{assignment[4] ? <Badge variant="success"><Check className='mb-1 mt-1' /> {assignment[6] ? (assignment[6] + '%') : null}</Badge> : <Badge variant="danger"><X className='mb-1 mt-1' /></Badge>}</h5>
                                </th>
                                <th className='p-0'>{assignment[1]}</th>
                                <th className='p-0'>{assignment[3]}</th>
                                <th className='p-0'>{assignment[2] ? assignment[2][1] : 'N/A'}</th>
                                <th className='p-0'>{assignment[7]}</th>
                                <th className='p-0'><Button size='sm' className='m-0' variant='secondary'
                                    onClick={() => {
                                        setSelectedAssignmentToEdit(assignment)
                                        setEditAssignmentModalShow(true)
                                    }}
                                ><PencilSquare className='mb-1' /></Button></th>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table >
    )
}

const getAllAssignments = (classesArray) => {
    let assignments = []

    classesArray.forEach((currentClass) => {
        let assignmentTypes = []

        currentClass.assignment_types.forEach((assignmentType) => {
            assignmentTypes.push([assignmentType._id, assignmentType.name, assignmentType.weight])
        })

        currentClass.assignments.forEach((assignment) => {
            const assignmentTypeInfo = assignmentTypes.find(at => at[0] === assignment.assignment_type_id)
            assignments.push([currentClass._id, currentClass.name, assignmentTypeInfo, assignment.name, assignment.turned_in, new Date(assignment.due_date), assignment.grade, assignment.notes, assignment._id])
        })
    })

    assignments.sort((a, b) => {
        if ((a[5] - b[5]) === 0) {
            return a[0] - b[0]
        } else {
            return a[5] - b[5]
        }
    })

    return assignments
}

const createAssignmentArrays = (assignmentsArray) => {
    // 0 = Past Due
    // 1 = Due This Week
    // 2 = Due This Month
    // 3 = All Due Assignments
    // 4 = All Completed Assignments
    // 5 = All Assignments

    let assignmentsArrays = [[], [], [], [], [], assignmentsArray]
    const today = new Date().setHours(0, 0, 0, 0)

    assignmentsArray.forEach((assignment) => {
        if (assignment[4] === true) {
            assignmentsArrays[4].push(assignment)
        } else {
            assignmentsArrays[3].push(assignment)

            if ((assignment[5] < today)) {
                assignmentsArrays[0].push(assignment)
            } else if (assignment[5] < (today + 604800000)) {
                assignmentsArrays[1].push(assignment)
            } else if (assignment[5] < (today + 2628000000)) {
                assignmentsArrays[2].push(assignment)
            }
        }
    })

    return assignmentsArrays
}

const formatDate = (date) => {
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${month}-${day}-${year}`)
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInfoPanel)