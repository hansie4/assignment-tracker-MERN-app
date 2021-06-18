import { useState } from 'react'

import { connect } from 'react-redux'

import { addSemester } from '../../../actions/trackerActions'

import {
    setError,
    clearError
} from '../../../actions/errorActions'

import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { Plus } from 'react-bootstrap-icons'

function AddSemesterPanel(props) {

    const [semesterName, setSemesterName] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    return (
        <div className="p-3">
            <div className='w-100 d-flex justify-content-center'>
                <Container>
                    <h2>Add New Semester</h2>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Semester Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => handleChange(event, setSemesterName)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Start Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type='date' onChange={(event) => handleChange(event, setStartDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>End Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type='date' onChange={(event) => handleChange(event, setEndDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <div className="d-flex justify-content-center">
                        {
                            props.isLoading ?
                                <Button variant="success" className="w-50" disabled>
                                    <Spinner animation="border" size="sm" />
                                </Button>
                                :
                                <Button variant="success" className="w-50" onClick={() => newSemesterSubmit(semesterName, startDate, endDate, props.addSemester, props.setError, props.clearError)}>
                                    Add Semester
                                    <Plus className='ms-2' />
                                </Button>
                        }
                    </div>
                </Container>
            </div>
        </div >
    )
}

const newSemesterSubmit = (name, start_date, end_date, addSemesterMethod, setErrorMethod, clearErrorMethod) => {
    if (!name) {
        setErrorMethod(null, 'Semester name required')
    } else {
        if (start_date > end_date) {
            setErrorMethod(null, 'Start date must be before end date')
        } else {
            clearErrorMethod()
            addSemesterMethod({ name, start_date, end_date })
        }
    }
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    isLoading: state.tracker.isLoading
})

const mapDispatchToProps = {
    addSemester,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSemesterPanel)