import {
    useState,
    useEffect
} from 'react'

import { connect } from 'react-redux'

import { useHistory } from 'react-router-dom'

import {
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices
} from '../../actions/accountActions'

import { clearError } from '../../actions/errorActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Toast from 'react-bootstrap/Toast'

import { ArrowBarLeft } from 'react-bootstrap-icons'

import InfoPanel from './panels/infoPanel'
import EmailPanel from './panels/emailPanel'
import UsernamePanel from './panels/usernamePanel'
import PasswordPanel from './panels/passwordPanel'
import DeletePanel from './panels/deletePanel'

function AccountPage({
    isLoading,
    error,
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices,
    clearError
}) {

    let history = useHistory()

    const [showError, setShowError] = useState(false)

    useEffect(() => {
        getAccountInfo()
    }, [getAccountInfo])

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
                    <Button variant='outline-light' onClick={() => redirectToDashboard(history, clearError)}>
                        Dashboard
                        <ArrowBarLeft className='ms-2' />
                    </Button>
                </Container>
            </Navbar>
            <Container fluid>
                <Row className='p-2 justify-content-center'>
                    <Col className='p-1 bg-light rounded-3' style={{ minHeight: '93vh' }}>
                        <div className="w-100 h-100 p-2">
                            <Tab.Container defaultActiveKey="info" transition={false}>
                                <Row className="h-100">
                                    <Col sm={10}>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="info">
                                                <InfoPanel />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="email">
                                                <EmailPanel />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="username">
                                                <UsernamePanel />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="password">
                                                <PasswordPanel />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="delete">
                                                <DeletePanel />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Col>
                                    <Col sm={2} className="border-start" >
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="info" disabled={isLoading}>Account Info</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Nav.Link eventKey="email" disabled={isLoading}>Change Email Address</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="username" disabled={isLoading}>Change Username</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="password" disabled={isLoading}>Change Password</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Button className="w-100 mb-2" variant="secondary" onClick={() => logoutUser()} disabled={isLoading}>Logout</Button>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Button className="w-100" variant="warning" onClick={() => logoutUserAllDevices()} disabled={isLoading}>Logout of all Devices</Button>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Nav.Link eventKey="delete" disabled={isLoading}>Delete Account</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                        </Nav>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
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

const redirectToDashboard = (history, clearErrorMethod) => {
    clearErrorMethod()
    history.push('/dashboard')
}

const mapStateToProps = state => ({
    isLoading: state.account.isLoading,
    error: state.error.error
})

const mapDispatchToProps = {
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)