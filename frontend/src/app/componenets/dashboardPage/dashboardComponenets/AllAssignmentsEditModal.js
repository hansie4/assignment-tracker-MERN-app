import { useEffect, useState } from 'react'

import { connect } from 'react-redux'

import { modifyAssignment, deleteAssignment, getSelectedSemesterInfo } from '../../../actions/trackerActions'

import Modal from 'react-bootstrap/Modal'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'

import { CheckCircleFill, XCircleFill, TrashFill, ClockFill, SaveFill } from 'react-bootstrap-icons'

function AllAssignmentEditModal({
    selected_semester_id,
    modifyAssignment,
    deleteAssignment,
    getSelectedSemesterInfo,
    show,
    close,
    assignment
}) {

    const [assignment_types, setAssignmentTypes] = useState(null)

    const [name, setName] = useState(null)
    const [notes, setNotes] = useState(null)
    const [due_date, setDueDate] = useState(null)
    const [dateChanged, setDateChanged] = useState(false)
    const [selectedAssignmentType, setSelectedAssignmentType] = useState(null)
    const [turned_in, setTurnedIn] = useState(false)
    const [grade, setGrade] = useState(null)

    useEffect(() => {
        if (assignment) {
            let at = null
            const selectedSemester = getSelectedSemesterInfo()
            if (selectedSemester) {
                const c = selectedSemester.classes.find(c => c._id === assignment[0])
                if (c) {
                    at = c.assignment_types
                }
            }
            setAssignmentTypes(at)
            setTurnedIn(assignment[4])
            if (assignment[2]) {
                const selectedAT = {
                    _id: assignment[2][0],
                    name: assignment[2][1],
                    weight: assignment[2][2]
                }
                setSelectedAssignmentType(selectedAT)
            } else {
                setSelectedAssignmentType(null)
            }
        }
    }, [assignment, getSelectedSemesterInfo])

    if (assignment && assignment_types) {
        return (
            <Modal show={show} onHide={close} centered backdrop="static" keyboard={false} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit '{assignment[3]}'</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className='mb-3'>
                        {
                            turned_in ?
                                <Button className='fw-bold' block variant='success' onClick={() => setTurnedIn(false)}>Status: Turned In <CheckCircleFill className='mb-1' /></Button>
                                :
                                <Button className='fw-bold' block variant='danger' onClick={() => setTurnedIn(true)}>Status: Not Turned In <ClockFill className='mb-1' /></Button>
                        }
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => handleChange(event, setName)} defaultValue={assignment[3]} type='text' />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Notes:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => handleChange(event, setNotes)} defaultValue={assignment[7]} type='text' />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Due Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => { handleChange(event, setDueDate); setDateChanged(true) }} defaultValue={formatDate(assignment[5])} type='date' />
                    </InputGroup>
                    <InputGroup className='mb-3 border rounded'>
                        <Dropdown className='w-100' as={ButtonGroup}>
                            <Button size='sm' variant='light' disabled>
                                {
                                    selectedAssignmentType ?
                                        selectedAssignmentType.name
                                        :
                                        'No assignment type selected'
                                }
                            </Button>
                            <Dropdown.Toggle size='sm' variant='light' className='border-left' />

                            <Dropdown.Menu >
                                {
                                    selectedAssignmentType ?
                                        assignment_types.map((value, index) => {
                                            if (value._id !== selectedAssignmentType._id) {
                                                return (
                                                    <Dropdown.Item key={index} onClick={() => setSelectedAssignmentType(value)}>
                                                        {value.name}
                                                    </Dropdown.Item>
                                                )
                                            } else {
                                                return null
                                            }
                                        })
                                        :
                                        assignment_types.map((value, index) => {
                                            return (
                                                <Dropdown.Item key={index} onClick={() => setSelectedAssignmentType(value)}>
                                                    {value.name}
                                                </Dropdown.Item>
                                            )
                                        })
                                }
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setSelectedAssignmentType(null)}>
                                    None
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Grade:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => handleChange(event, setGrade)} defaultValue={assignment[3]} disabled={!turned_in} type='number' />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup className='w-100'>
                        <Button variant='danger' onClick={() => deleteAssignment({ assignment_id: assignment[8], class_id: assignment[0], semester_id: selected_semester_id })}><TrashFill /></Button>
                        <Button variant='secondary' onClick={() => close()}><XCircleFill /></Button>
                        <Button variant='success' onClick={() => modifyAssignment({ assignment_id: assignment[8], class_id: assignment[0], semester_id: selected_semester_id, new_name: name, new_notes: notes, new_due_date: (dateChanged ? due_date : null), new_assignment_type_id: (selectedAssignmentType ? selectedAssignmentType._id : null), new_turned_in: turned_in, new_grade: grade })}><SaveFill /></Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal >
        )
    } else {
        return (
            <div></div>
        )
    }
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const formatDate = (date) => {
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${year}-${month}-${day}`)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id
})

const mapDispatchToProps = {
    modifyAssignment,
    deleteAssignment,
    getSelectedSemesterInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(AllAssignmentEditModal)