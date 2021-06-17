import { useState } from 'react'

import { connect } from 'react-redux'

import {
    modifyClass,
    deleteClass
} from '../../../actions/trackerActions'

import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { GearFill, TrashFill, XCircleFill, CheckCircleFill } from 'react-bootstrap-icons'

function ClassInfoPanel({
    selectedClass,
    modifyClass,
    deleteClass,
    selected_semester_id
}) {

    const [modify, setModify] = useState(false)

    const [new_name, setNewName] = useState(null)
    const [new_description, setNewDescription] = useState(null)

    if (selectedClass) {
        return (
            <Card className='border border-dark'>
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>{selectedClass.name}:</Card.Title>
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
                {/* <Card.Header className='d-flex justify-content-between p-1 ps-3'>
                    <h3>{selectedClass.name}</h3>
                    <ButtonGroup size="sm">
                        <Button variant='secondary' onClick={() => setModifyMode(!modifyMode)}><GearFill /></Button>
                        <Button variant='danger' onClick={() => deleteClass({ class_id: selectedClass._id, semester_id: selected_semester_id })}><TrashFill /></Button>
                    </ButtonGroup>
                </Card.Header> */}
                <Card.Body>
                    {
                        modify ?
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>New Class Name:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl defaultValue={selectedClass.name} onChange={(event) => handleChange(event, setNewName)} />
                            </InputGroup>
                            :
                            null
                    }
                    <Card.Title>Description:</Card.Title>
                    {
                        modify ?
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>New Description:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl defaultValue={selectedClass.description} onChange={(event) => handleChange(event, setNewDescription)} />
                            </InputGroup>
                            :
                            <Card.Text>{selectedClass.description}</Card.Text>
                    }
                </Card.Body>
                {
                    modify ?
                        <Card.Footer>
                            <ButtonGroup className='w-100'>
                                <Button variant='danger' onClick={() => deleteClass({ class_id: selectedClass._id, semester_id: selected_semester_id })}><TrashFill /></Button>
                                <Button variant='success' onClick={() => modifyClass({ class_id: selectedClass._id, semester_id: selected_semester_id, new_name, new_description })}><CheckCircleFill /></Button>
                            </ButtonGroup>
                        </Card.Footer>
                        :
                        null
                }
            </Card>
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

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id
})

const mapDispatchToProps = {
    modifyClass,
    deleteClass
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInfoPanel)