import { useState } from "react"

import { connect } from "react-redux"

import {
    addAssignmentType,
    deleteAssignmentType
} from "../../../actions/trackerActions"

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { GearFill, XCircleFill, PlusCircleFill } from 'react-bootstrap-icons'

function AssignmentTypesPanel({
    assignmentTypes,
    addAssignmentType,
    deleteAssignmentType,
    selected_semester_id,
    selected_class_id
}) {

    const [modify, setModify] = useState(false)
    const [new_name, setNewName] = useState(null)
    const [new_weight, setNewWeight] = useState(null)

    return (
        <Card className='border border-dark'>
            <Card.Header className='p-0'>
                <div className='d-flex justify-content-between'>
                    <Card.Title className='m-2 text-decoration-underline'>Assignment Types:</Card.Title>
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
                            <th>Weight</th>
                            {modify ? <th></th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            assignmentTypes.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{value.name}</th>
                                        <th>{value.weight}%</th>
                                        {
                                            modify ?
                                                <th><Button size='sm' className='m-0' variant='danger' onClick={() => deleteAssignmentType({ assignment_type_id: value._id, class_id: selected_class_id, semester_id: selected_semester_id })}><XCircleFill className='mb-1' /></Button></th>
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
                                    <th className='p-0'><InputGroup size='sm'><FormControl placeholder='Name' onChange={(event) => handleChange(event, setNewName)} /></InputGroup></th>
                                    <th className='p-0'><InputGroup size='sm'><FormControl placeholder='Weight' type='number' onChange={(event) => handleChange(event, setNewWeight)} /><InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append></InputGroup></th>
                                    <th className='p-0'><InputGroup size='sm'><Button size='sm' onClick={() => addAssignmentType({ class_id: selected_class_id, semester_id: selected_semester_id, name: new_name, weight: new_weight })} className='m-0 h-100 w-100' variant='outline-success'><PlusCircleFill className='mb-1' /></Button></InputGroup></th>
                                </tr>
                            </tfoot>
                            :
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>
                                        {assignmentTypes.reduce((total, currentAssignmentType) => total + currentAssignmentType.weight, 0)}%
                                    </th>
                                </tr>
                            </tfoot>
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
    addAssignmentType,
    deleteAssignmentType
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentTypesPanel)