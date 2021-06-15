import { useState } from 'react'

import { connect } from 'react-redux'

import { addClass } from '../../../../actions/trackerActions'

import Modal from 'react-bootstrap/Modal'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { PlusCircleFill } from 'react-bootstrap-icons'
import { XCircleFill } from 'react-bootstrap-icons'

function AddClassModal(props) {

    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)

    return (
        <Modal show={props.show} onHide={props.close} centered backdrop="static" keyboard={false} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Class</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup className='mb-3'>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Name:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={(event) => handleChange(event, setName)} disabled={props.isLoading} />
                </InputGroup>
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text>Description:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={(event) => handleChange(event, setDescription)} disabled={props.isLoading} />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup className='w-100'>
                    <Button disabled={props.isLoading} variant='primary' onClick={() => props.addClass({ semester_id: props.selected_semester_id, name, description })}><PlusCircleFill /></Button>
                    <Button disabled={props.isLoading} variant='secondary' onClick={() => props.close()}><XCircleFill /></Button>
                </ButtonGroup>
            </Modal.Footer>
        </Modal>
    )
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    isLoading: state.tracker.isLoading
})

const mapDispatchToProps = {
    addClass
}

export default connect(mapStateToProps, mapDispatchToProps)(AddClassModal)