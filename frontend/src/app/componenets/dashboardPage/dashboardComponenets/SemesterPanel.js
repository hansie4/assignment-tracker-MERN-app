import { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import { getSelectedClassInfo } from '../../../actions/trackerActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card'

import ClassSelectPanel from "./ClassSelectPanel"
import ClassInfoPanel from "./ClassInfoPanel"
import InstructorsPanel from './InstructorsPanel'
import AssignmentTypesPanel from './AssignmentTypesPanel'
import ClassAssignmentsPanel from './ClassAssignmentsPanel'

function SemesterPanel({
    semester,
    selected_semester_id,
    selected_class_id,
    getSelectedClassInfo
}) {

    const [selectedClass, setSelectedClass] = useState(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setSelectedClass(getSelectedClassInfo())
    }, [getSelectedClassInfo, selected_class_id, selected_semester_id])

    useEffect(() => {
        setProgress(calculateProgress(semester.start_date, semester.end_date))
    }, [semester])

    return (
        <Container >
            {
                (semester.start_date && semester.end_date) ?
                    <Row>
                        <Col>
                            <Card className='border border-dark'>
                                <Card.Header>
                                    <Card.Title>{semester.name} Progress:</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <ProgressBar now={progress} label={progress.toString().concat('%')} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    :
                    null
            }
            <Row className='mt-3 border-top border-dark'>
                <Col className='mb-3 pt-3' lg={3}>
                    <ClassSelectPanel classes={semester.classes} />
                </Col>
                {
                    selectedClass ?
                        <Col className='pt-3' lg={9}>
                            <Container className='p-0'>
                                <Row>
                                    <Col className='mb-3' lg={6}>
                                        <ClassInfoPanel selectedClass={selectedClass} />
                                    </Col>
                                    <Col className='mb-3' lg={6}>
                                        <AssignmentTypesPanel assignmentTypes={selectedClass.assignment_types} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mb-3' lg={12}>
                                        <InstructorsPanel instructors={selectedClass.instructors} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='mb-3' lg={12}>
                                        <ClassAssignmentsPanel selectedClass={selectedClass} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        :
                        null
                }
            </Row>
        </Container>
    )
}

const calculateProgress = (start_date, end_date) => {
    const current_date = new Date()
    const parsed_start_date = new Date(start_date)
    const parsed_end_date = new Date(end_date)

    if (current_date >= parsed_end_date) {
        return 100
    } else if (current_date <= parsed_start_date) {
        return 0
    } else {
        return parseInt(((current_date - parsed_start_date) / (parsed_end_date - parsed_start_date)) * 100)
    }
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    getSelectedClassInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(SemesterPanel)