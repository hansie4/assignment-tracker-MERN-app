import { useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import { logoutUser } from '../../actions/accountActions'
import { getTrackerInfo } from '../../actions/trackerActions'
import { clearError } from '../../actions/errorActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Toast from 'react-bootstrap/Toast'

import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons'

import TrackerDisplay from './dashboardComponenets/TrackerDisplay'

function Dashboard({
    error,
    getTrackerInfo,
    logoutUser,
    clearError
}) {

    let history = useHistory()

    const [showError, setShowError] = useState(false)

    useEffect(() => {
        getTrackerInfo()
    }, [getTrackerInfo])

    useEffect(() => {
        error ?
            setShowError(true)
            :
            setShowError(false)
    }, [error])

    return (
        <Container fluid className='p-0'>
            <Navbar variant="dark" bg="dark">
                <Container fluid className='d-flex justify-content-between'>
                    <Navbar.Brand href='/dashboard'>Assignment Tracker</Navbar.Brand>
                    <ButtonGroup>
                        <Button variant='outline-light' onClick={() => redirectToAccountPage(history, clearError)}>
                            Account
                            <PersonCircle className='ms-2' />
                        </Button>
                        <Button variant='outline-light' onClick={() => logoutUser()}>
                            Logout
                            <BoxArrowRight className='ms-2' />
                        </Button>
                    </ButtonGroup>
                </Container>
            </Navbar>
            <Container fluid>
                <Row className='p-2 justify-content-center'>
                    <Col className='p-0 bg-light rounded-3' style={{ minHeight: '93vh' }}>

                        <TrackerDisplay />

                        <Toast
                            className="m-3 bg-warning"
                            show={showError}
                            onClose={() => {
                                setShowError(false); clearError()
                            }}
                            style={{ position: 'fixed', bottom: 0, right: 0 }}
                            animation={false}
                        >
                            <Toast.Header>
                                <strong className="mr-auto">Error</strong>
                            </Toast.Header>
                            <Toast.Body>{error ? error.message : null}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

const redirectToAccountPage = (history, clearErrorMethod) => {
    clearErrorMethod()
    history.push('/account')
}

const mapStateToProps = state => ({
    error: state.error.error
})

const mapDispatchToProps = {
    getTrackerInfo,
    logoutUser,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)