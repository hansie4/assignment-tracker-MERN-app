import { useState } from 'react'

import { connect } from 'react-redux'

import {
    addInstructor,
    deleteInstructor
} from '../../../actions/trackerActions'

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { Plus, XCircleFill } from 'react-bootstrap-icons'

function InstructorsPanel({
    instructors,
    addInstructor,
    deleteInstructor,
    selected_semester_id,
    selected_class_id
}) {

    const [name, setName] = useState(null)
    const [email_address, setEmail] = useState(null)
    const [office_hours_info, setInfo] = useState(null)

    return (
        <Card className='border border-dark'>
            <Card.Header>
                <Card.Title>Instructors</Card.Title>
            </Card.Header>
            <Card.Body className='p-0'>
                <Table striped hover className='m-0'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Office Hours Info</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            instructors.map((value, index) => {

                                let modfiy = false

                                return (
                                    <tr>
                                        <th>{modfiy ? 60 : (index + 1)}</th>
                                        <th>{value.name}</th>
                                        <th>{value.email_address}</th>
                                        <th>{value.office_hours_info}</th>
                                        <th className='p-0'>
                                            <ButtonGroup size='sm' className='pt-1'>
                                                <Button variant='outline-danger' onClick={() => deleteInstructor({ class_id: selected_class_id, semester_id: selected_semester_id, instructor_id: value._id })}><XCircleFill /></Button>
                                            </ButtonGroup>
                                        </th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <th>{instructors.length + 1}</th>
                        <th className='p-0'><InputGroup><FormControl onChange={(event) => handleChange(event, setName)} /></InputGroup></th>
                        <th className='p-0'><InputGroup><FormControl onChange={(event) => handleChange(event, setEmail)} /></InputGroup></th>
                        <th className='p-0'><InputGroup><FormControl onChange={(event) => handleChange(event, setInfo)} /></InputGroup></th>
                        <th className='p-0'><InputGroup><Button variant='success' onClick={() => addInstructor({ class_id: selected_class_id, semester_id: selected_semester_id, name, email_address, office_hours_info })}><Plus /></Button></InputGroup></th>
                    </tfoot>
                </Table>
            </Card.Body>
        </Card>
    )
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    addInstructor,
    deleteInstructor
}

export default connect(mapStateToProps, mapDispatchToProps)(InstructorsPanel)