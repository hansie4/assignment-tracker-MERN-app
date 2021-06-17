import { useState } from 'react'

import { connect } from 'react-redux'

import {
    modifySemester,
    deleteSemester
} from '../../../actions/trackerActions'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { Save } from 'react-bootstrap-icons'
import { Trash } from 'react-bootstrap-icons'

function ModifySemesterPanel(props) {

    const [new_name, setNewSemesterName] = useState(null)
    const [new_start_date, setNewStartDate] = useState(null)
    const [new_end_date, setNewEndDate] = useState(null)
    const [deleteDates, setDeleteDates] = useState(false)

    return (
        <div className="p-3">
            <div className='w-100 d-flex justify-content-center'>
                <div className='w-50'>
                    <h2>Modify Semester</h2>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Semester Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={props.semester.name} onChange={(event) => handleChange(event, setNewSemesterName)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Start Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={props.semester.start_date ? formatDate(new Date(props.semester.start_date)) : null} type='date' onChange={(event) => handleChange(event, setNewStartDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>End Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl defaultValue={props.semester.end_date ? formatDate(new Date(props.semester.end_date)) : null} type='date' onChange={(event) => handleChange(event, setNewEndDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Remove Dates?</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup.Append>
                            <InputGroup.Checkbox onChange={(event) => handleCheckInput(event, setDeleteDates)} />
                        </InputGroup.Append>
                    </InputGroup>
                    <hr />
                    <div className="d-flex justify-content-center mb-3">
                        {
                            props.isLoading ?
                                <Button variant="success" className="w-50" disabled>
                                    <Spinner animation="border" size="sm" />
                                </Button>
                                :
                                <Button variant="success" className="w-50" onClick={() => props.modifySemester({ semester_id: props.selected_semester_id, new_name, new_start_date, new_end_date, deleteDates })}>
                                    Save Changes
                                    <Save className='ms-2' />
                                </Button>
                        }
                    </div>
                    <div className="d-flex justify-content-center mb-3">
                        {
                            props.isLoading ?
                                <Button variant="danger" className="w-50" disabled>
                                    <Spinner animation="border" size="sm" />
                                </Button>
                                :
                                <Button variant="danger" className="w-50" onClick={() => props.deleteSemester({ semester_id: props.selected_semester_id })}>
                                    Delete Semester
                                    <Trash className='ms-2' />
                                </Button>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const handleCheckInput = (event, setMethod) => {
    setMethod(event.target.checked)
}

const formatDate = (date) => {
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${year}-${month}-${day}`)
}

const mapStateToProps = state => ({
    isLoading: state.tracker.isLoading,
    selected_semester_id: state.tracker.selected_semester_id
})

const mapDispatchToProps = {
    modifySemester,
    deleteSemester
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifySemesterPanel)