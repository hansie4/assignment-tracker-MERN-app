import {
    useState,
    useEffect
} from 'react'

import { connect } from 'react-redux'

import {
    selectSemester,
    getSelectedSemesterInfo
} from '../../../actions/trackerActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { GearFill } from 'react-bootstrap-icons'
import { Arrow90degLeft } from 'react-bootstrap-icons'

import AddSemesterPanel from './AddSemesterPanel'
import ModifySemesterPanel from './ModifySemesterPanel'
import SemesterPanel from './SemesterPanel'

function TrackerDisplay({
    semesters,
    selected_semester_id,
    isLoading,
    selectSemester,
    getSelectedSemesterInfo
}) {

    const [semesterShown, setSemesterShown] = useState(false)
    const [modifyShown, setModifyShown] = useState(false)
    const [currentSemester, setCurrentSemester] = useState(null)

    useEffect(() => {
        setCurrentSemester(getSelectedSemesterInfo())
    }, [semesters, getSelectedSemesterInfo])

    useEffect(() => {
        if (selected_semester_id) {
            setCurrentSemester(getSelectedSemesterInfo())
            setSemesterShown(true)
            setModifyShown(false)
        } else {
            setSemesterShown(false)
            setModifyShown(false)
        }
    }, [selected_semester_id, getSelectedSemesterInfo])

    return (
        <Container fluid className='p-2'>
            <Row>
                <Col className='d-flex justify-content-between'>
                    <DropdownButton
                        title={
                            selected_semester_id ?
                                semesterShown ?
                                    currentSemester ?
                                        currentSemester.name
                                        :
                                        ''
                                    :
                                    ''
                                :
                                ''
                        }
                        size='lg'
                        variant='light'>
                        {semesters.map((semester, index) => {
                            return (
                                <Dropdown.Item key={index} onClick={() => {
                                    selectSemester(semester._id)
                                    setSemesterShown(true)
                                }}
                                >
                                    {semester.name}
                                </Dropdown.Item>
                            )
                        })}
                        <Dropdown.Divider />
                        <Dropdown.Item
                            onClick={() => {
                                setSemesterShown(false)
                                setModifyShown(false)
                            }}
                        >
                            Add New Semester
                        </Dropdown.Item>
                    </DropdownButton>
                    {
                        semesterShown ?
                            modifyShown ?
                                <Button
                                    variant='secondary'
                                    onClick={() => {
                                        setModifyShown(false)
                                    }}
                                >
                                    <Arrow90degLeft />
                                </Button>
                                :
                                <Button
                                    variant='secondary'
                                    onClick={() => {
                                        setModifyShown(true)
                                    }}
                                >
                                    <GearFill />
                                </Button>
                            :
                            null
                    }
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    {
                        isLoading ?
                            <div className='d-flex justify-content-center'>
                                <Spinner animation="border" variant='dark' style={{ width: '5rem', height: '5rem' }} />
                            </div>
                            :
                            semesterShown ?
                                modifyShown ?
                                    <div>
                                        <ModifySemesterPanel semester={currentSemester} />
                                    </div>
                                    :
                                    <div>
                                        <SemesterPanel semester={currentSemester} />
                                    </div>
                                :
                                <AddSemesterPanel />
                    }
                </Col>
            </Row>
        </Container>
    )
}

const mapStateToProps = state => ({
    semesters: state.tracker.semesters,
    selected_semester_id: state.tracker.selected_semester_id,
    isLoading: state.tracker.isLoading
})

const mapDispatchToProps = {
    selectSemester,
    getSelectedSemesterInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDisplay)