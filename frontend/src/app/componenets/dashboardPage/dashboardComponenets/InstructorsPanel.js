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

import { PlusCircleFill, XCircleFill, GearFill } from 'react-bootstrap-icons'

function InstructorsPanel({
    instructors,
    addInstructor,
    deleteInstructor,
    selected_semester_id,
    selected_class_id
}) {

    const [modify, setModify] = useState(false)
    const [name, setName] = useState(null)
    const [email_address, setEmail] = useState(null)
    const [office_hours_info, setInfo] = useState(null)

    return (
        <Card className='border border-dark'>
            <Card.Header className='p-0'>
                <div className='d-flex justify-content-between'>
                    <Card.Title className='m-2 text-decoration-underline'>Instructors:</Card.Title>
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
                <Table striped hover className='m-0' size='sm' responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Office Hours Info</th>
                            {modify ? <th></th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            instructors.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{value.name}</th>
                                        <th>{value.email_address}</th>
                                        <th>{value.office_hours_info}</th>
                                        {
                                            modify ?
                                                <th><Button size='sm' className='m-0' variant='danger' onClick={() => deleteInstructor({ class_id: selected_class_id, semester_id: selected_semester_id, instructor_id: value._id })}><XCircleFill className='mb-1' /></Button></th>
                                                :
                                                null
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
                                    <th className='p-0'><InputGroup size='sm'><FormControl placeholder='Name' onChange={(event) => handleChange(event, setName)} /></InputGroup></th>
                                    <th className='p-0'><InputGroup size='sm'><FormControl placeholder='Email Address' onChange={(event) => handleChange(event, setEmail)} /></InputGroup></th>
                                    <th className='p-0'><InputGroup size='sm'><FormControl placeholder='Office Hours Info' onChange={(event) => handleChange(event, setInfo)} /></InputGroup></th>
                                    <th className='p-0'><InputGroup size='sm'><Button size='sm' onClick={() => addInstructor({ class_id: selected_class_id, semester_id: selected_semester_id, name, email_address, office_hours_info })} className='m-0 h-100 w-100' variant='outline-success'><PlusCircleFill className='mb-1' /></Button></InputGroup></th>
                                </tr>
                            </tfoot>
                            :
                            null
                    }
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