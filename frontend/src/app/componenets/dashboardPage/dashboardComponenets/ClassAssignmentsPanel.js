import { useState } from "react"

import { connect } from "react-redux"

import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'

import { FileEarmarkText, Plus, Check, X, PencilSquare } from 'react-bootstrap-icons'

import EditAssignmentModal from './EditAssignmentModal'
import AddAssignmentModal from './AddAssignmentModal'

function ClassAssignmentsPanel({
    selectedClass
}) {

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [assignmentToEdit, setAssignmentToEdit] = useState(null)

    return (
        <div>
            <AddAssignmentModal show={addModal} close={() => setAddModal(false)} assignment_types={selectedClass.assignment_types} />
            <EditAssignmentModal show={editModal} close={() => setEditModal(false)} assignment={assignmentToEdit} assignment_types={selectedClass.assignment_types} />
            <Card className='border border-dark'>
                <Card.Header className='p-0'>
                    <div className='d-flex justify-content-between'>
                        <Card.Title className='m-2 text-decoration-underline'>Assignments:</Card.Title>
                        <Button onClick={() => setAddModal(true)} className='m-0' variant='success'><Plus className='mb-1' /><FileEarmarkText className='mb-1' /></Button>
                    </div>
                </Card.Header>
                <Card.Body className='p-0'>
                    <Table striped hover className='m-0' size='sm' responsive>
                        <thead>
                            <tr>
                                <th>Done?</th>
                                <th>Grade</th>
                                <th>Due Date</th>
                                <th>Assignment Type</th>
                                <th>Name</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedClass.assignments.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <th><h5>{value.turned_in ? <Badge variant="success"><Check className='mb-1 mt-1' /></Badge> : <Badge variant="danger"><X className='mb-1 mt-1' /></Badge>}</h5></th>
                                            <th>{value.grade}{value.grade ? '%' : null}</th>
                                            <th>{formatDate(value.due_date)}</th>
                                            <th>
                                                {
                                                    selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value.assignment_type_id) ?
                                                        selectedClass.assignment_types.find((assignmentType) => assignmentType._id === value.assignment_type_id).name
                                                        :
                                                        null
                                                }
                                            </th>
                                            <th>{value.name}</th>
                                            <th>{value.notes}</th>
                                            <th><Button size='sm' className='m-0' variant='secondary' onClick={() => {
                                                setEditModal(true)
                                                setAssignmentToEdit(value)
                                            }} ><PencilSquare className='mb-1' /></Button></th>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    return (`${month}-${day}-${year}`)
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ClassAssignmentsPanel)