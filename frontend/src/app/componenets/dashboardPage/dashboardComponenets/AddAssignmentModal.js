import { useState } from 'react'

import { connect } from 'react-redux'

import { addAssignment } from '../../../actions/trackerActions'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Dropdown from 'react-bootstrap/Dropdown'

import { XCircleFill, Plus, FileEarmarkText } from 'react-bootstrap-icons'

function AddAssignmentModal({
    show,
    close,
    assignment_types,
    addAssignment,
    selected_semester_id,
    selected_class_id
}) {

    const [name, setName] = useState(null)
    const [notes, setNotes] = useState(null)
    const [due_date, setDueDate] = useState(null)
    const [selectedAssignmentType, setSelectedAssignmentType] = useState(null)
    const [turned_in, setTurnedIn] = useState(false)
    const [grade, setGrade] = useState(null)

    return (
        <Modal show={show} onHide={close} centered backdrop="static" keyboard={false} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup className='w-100'>
                    <Button variant='secondary' onClick={() => close()}><XCircleFill /></Button>
                    <Button variant='success' onClick={() => addAssignment({ class_id: selected_class_id, semester_id: selected_semester_id, name, notes, due_date, assignment_type_id: (selectedAssignmentType ? selectedAssignmentType._id : null), turned_in, grade })}><Plus className='mb-1' /><FileEarmarkText className='mb-1' /></Button>
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
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    addAssignment
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAssignmentModal)