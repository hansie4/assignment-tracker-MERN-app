import { useState, useEffect } from "react"

import { connect } from "react-redux"

import {
    addAssignment,
    deleteAssignment,
    modifyAssignment
} from "../../../actions/trackerActions"

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Badge from 'react-bootstrap/Badge'

import { GearFill, XCircleFill, PlusCircleFill, Check, X, PencilSquare } from 'react-bootstrap-icons'

import AssignmentEditModal from './AssignmentEditModal'

function ClassAssignmentsPanel({
    selectedClass,
    addAssignment,
    deleteAssignment,
    modifyAssignment,
    selected_semester_id,
    selected_class_id
}) {

    const [modify, setModify] = useState(false)

    const [editModal, setEditModal] = useState(false)
    const [assignmentToEdit, setAssignmentToEdit] = useState(null)

    const [turned_in, setTurnedIn] = useState(false)
    const [grade, setGrade] = useState(null)
    const [due_date, setDueDate] = useState(null)
    const [name, setName] = useState(null)
    const [selectedAssignmentType, setSelectedAssignmentType] = useState(null)
    const [notes, setNotes] = useState(null)

    useEffect(() => {
        if (selectedClass) {
            if (selectedClass.assignment_types.length > 0) {
                setSelectedAssignmentType(selectedClass.assignment_types[0])
            }
        }
    }, [selectedClass])

    return (
        <div>
            <AssignmentEditModal show={editModal} close={() => setEditModal(false)} assignment={assignmentToEdit} />
            <Card className='border border-dark'>
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>Assignments:</Card.Title>
                        <Button onClick={() => setModify(!modify)} className='m-0' variant='secondary'>
                            {
                                modify ?
                                    <XCircleFill className='mb-1' />
                                    :
                                    <GearFill className='mb-1' />
                            }
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    <Table striped hover className='m-0' size='sm'>
                        <thead>
                            <tr>
                                <th>Done?</th>
                                <th>Grade</th>
                                <th>Due Date</th>
                                <th>Assignment Type</th>
                                <th>Name</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedClass.assignments.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <th><h5>{value.turned_in ? <Badge variant="success"><Check className='mb-1 mt-1' /></Badge> : <Badge variant="danger"><X className='mb-1 mt-1' /></Badge>}</h5></th>
                                            <th>{value.grade}{value.grade ? '%' : null}</th>
                                            <th>{formatDate(new Date(value.due_date))}</th>
                                            <th>
                                                {
                                                    selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value.assignment_type_id) ?
                                                        selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value.assignment_type_id).name
                                                        :
                                                        null
                                                }
                                            </th>
                                            <th>{value.name}</th>
                                            <th>{value.notes}</th>
                                            {
                                                modify ?
                                                    <th><Button size='sm' className='m-0' variant='danger' onClick={() => deleteAssignment({ assignment_id: value._id, class_id: selected_class_id, semester_id: selected_semester_id })}><XCircleFill className='mb-1' /></Button></th>
                                                    :
                                                    <th><Button size='sm' className='m-0' variant='secondary' onClick={() => {
                                                        setEditModal(true)
                                                        setAssignmentToEdit(value)
                                                    }} ><PencilSquare className='mb-1' /></Button></th>
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        {
                            modify ?
                                <tfoot>
                                    <tr>
                                        <th><InputGroup><Form.Check onChange={(event) => handleCheckInput(event, setTurnedIn)} /></InputGroup></th>
                                        <th className='p-0'><InputGroup size='sm'><FormControl onChange={(event) => handleChange(event, setGrade)} placeholder='Grade' type='number' /><InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append></InputGroup></th>
                                        <th className='p-0'><InputGroup size='sm'><FormControl onChange={(event) => handleChange(event, setDueDate)} type='date' /></InputGroup></th>
                                        <th className='p-0' >
                                            <InputGroup>
                                                <Dropdown className='w-100' as={ButtonGroup}>
                                                    <Button size='sm' variant='light' disabled>
                                                        {
                                                            selectedAssignmentType ?
                                                                selectedAssignmentType.name
                                                                :
                                                                'No assignment types'
                                                        }
                                                    </Button>
                                                    <Dropdown.Toggle size='sm' variant='light' />

                                                    <Dropdown.Menu >
                                                        {
                                                            selectedClass.assignment_types.map((value, index) => {
                                                                return (
                                                                    <Dropdown.Item key={index} onClick={() => setSelectedAssignmentType(value)}>
                                                                        {value.name}
                                                                    </Dropdown.Item>
                                                                )
                                                            })
                                                        }
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </InputGroup>
                                        </th>
                                        <th className='p-0'><InputGroup size='sm'><FormControl onChange={(event) => handleChange(event, setName)} placeholder='Name' type='text' /></InputGroup></th>
                                        <th className='p-0'><InputGroup size='sm'><FormControl onChange={(event) => handleChange(event, setNotes)} placeholder='Notes' type='text' /></InputGroup></th>
                                        <th className='p-0'><InputGroup size='sm'><Button onClick={() => addAssignment({ class_id: selected_class_id, semester_id: selected_semester_id, name, notes, due_date, assignment_type_id: selectedAssignmentType._id, turned_in, grade })} size='sm' className='m-0' variant='success'><PlusCircleFill className='mb-1' /></Button></InputGroup></th>
                                    </tr>
                                </tfoot>
                                :
                                null
                        }
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const handleCheckInput = (event, setMethod) => {
    setMethod(event.target.checked)
}

const formatDate = (date) => {
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${day}-${month}-${year}`)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    addAssignment,
    deleteAssignment,
    modifyAssignment
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassAssignmentsPanel)