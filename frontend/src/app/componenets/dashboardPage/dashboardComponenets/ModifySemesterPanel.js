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

    return (
        <div className="p-3">
            <div className='w-100 d-flex justify-content-center'>
                <div className='w-50'>
                    <h2>Modify Semester</h2>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Current Semester Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder={props.semester.name} disabled />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>New Semester Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={(event) => handleChange(event, setNewSemesterName)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Current Start Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder={props.semester.start_date ? formatedDate(props.semester.start_date) : 'null'} disabled />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>New Start Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type='date' onChange={(event) => handleChange(event, setNewStartDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Current Start End:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder={props.semester.end_date ? formatedDate(props.semester.end_date) : 'null'} disabled />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>New End Date:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type='date' onChange={(event) => handleChange(event, setNewEndDate)} disabled={props.isLoading} />
                    </InputGroup>
                    <hr />
                    <div className="d-flex justify-content-center mb-3">
                        {
                            props.isLoading ?
                                <Button variant="success" className="w-50" disabled>
                                    <Spinner animation="border" size="sm" />
                                </Button>
                                :
                                <Button variant="success" className="w-50" onClick={() => props.modifySemester({ semester_id: props.selected_semester_id, new_name, new_start_date, new_end_date })}>
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

const formatedDate = (date) => {
    return new Date(date)
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