import { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import { addAssignment, getSelectedSemesterInfo } from '../../../actions/trackerActions'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'

import { XCircleFill, Plus, FileEarmarkText } from 'react-bootstrap-icons'

function AllAssignmentsAddModal({
    selected_semester_id,
    addAssignment,
    getSelectedSemesterInfo,
    show,
    close,
}) {

    const [semesterInfo, setSemesterInfo] = useState(null)

    const [selectedClass, setSelectedClass] = useState(null)
    const [name, setName] = useState(null)
    const [notes, setNotes] = useState(null)
    const [due_date, setDueDate] = useState(null)
    const [selectedAssignmentType, setSelectedAssignmentType] = useState(null)
    const [turned_in, setTurnedIn] = useState(false)
    const [grade, setGrade] = useState(null)

    useEffect(() => {
        setSemesterInfo(getSelectedSemesterInfo())
    }, [selected_semester_id, getSelectedSemesterInfo])

    return (
        <Modal show={show} onHide={close} centered backdrop="static" keyboard={false} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Assignment</Modal.Title>
            </Modal.Header>
            {
                semesterInfo ?
                    <Modal.Body>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Class:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Dropdown className='border rounded' as={ButtonGroup}>
                                <Button size='sm' variant='light' disabled>
                                    {
                                        selectedClass ?
                                            selectedClass.name
                                            :
                                            'No Class selected'
                                    }
                                </Button>
                                <Dropdown.Toggle size='sm' variant='light' className='border-left' />

                                <Dropdown.Menu >
                                    {
                                        selectedClass ?
                                            semesterInfo.classes.map((value, index) => {
                                                if (value._id !== selectedClass._id) {
                                                    return (
                                                        <Dropdown.Item key={index} onClick={() => setSelectedClass(value)}>
                                                            {value.name}
                                                        </Dropdown.Item>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            })
                                            :
                                            semesterInfo.classes.map((value, index) => {
                                                return (
                                                    <Dropdown.Item key={index} onClick={() => setSelectedClass(value)}>
                                                        {value.name}
                                                    </Dropdown.Item>
                                                )
                                            })
                                    }
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => setSelectedClass(null)}>
                                        None
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </InputGroup>
                        {
                            selectedClass ?
                                <div>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Assignment Name:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl type='text' onChange={(event) => handleChange(event, setName)} />
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Assignment Notes:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl type='text' onChange={(event) => handleChange(event, setNotes)} />
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Due Date:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl type='date' onChange={(event) => handleChange(event, setDueDate)} />
                                    </InputGroup>
                                    <InputGroup className='mb-3'>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Assignment Type:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Dropdown className='border rounded' as={ButtonGroup}>
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
                                                        selectedClass.assignment_types.map((value, index) => {
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
                                                        selectedClass.assignment_types.map((value, index) => {
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
                                            <InputGroup.Text>Turned In?</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <InputGroup.Checkbox onChange={(event) => handleCheckChange(event, setTurnedIn)} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Grade</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl type='number' onChange={(event) => handleChange(event, setGrade)} disabled={!turned_in} />
                                        <InputGroup.Append>
                                            <InputGroup.Text>%</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                                :
                                null
                        }
                    </Modal.Body>
                    :
                    null
            }
            <Modal.Footer>
                <ButtonGroup className='w-100'>
                    <Button variant='secondary' onClick={() => close()}><XCircleFill /></Button>
                    <Button variant='success' onClick={() => addAssignment({ class_id: selectedClass._id, semester_id: selected_semester_id, name, notes, due_date, assignment_type_id: (selectedAssignmentType ? selectedAssignmentType._id : null), turned_in, grade })}><Plus className='mb-1' /><FileEarmarkText className='mb-1' /></Button>
                </ButtonGroup>
            </Modal.Footer>
        </Modal >
    )
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const handleCheckChange = (event, setMethod) => {
    setMethod(event.target.checked)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id
})

const mapDispatchToProps = {
    addAssignment,
    getSelectedSemesterInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(AllAssignmentsAddModal)