import { connect } from 'react-redux'

import { useHistory } from 'react-router-dom'

import {
    changeEmailAddress,
    changeUsername,
    changePassword,
    logoutUser,
    logoutUserAllDevices,
    deleteAccount
} from '../../actions/accountActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'

import { ArrowBarLeft } from 'react-bootstrap-icons'

import InfoPanel from './panels/infoPanel'
import EmailPanel from './panels/emailPanel'
import UsernamePanel from './panels/usernamePanel'
import PasswordPanel from './panels/passwordPanel'
import DeletePanel from './panels/deletePanel'

function AccountPage(props) {

    let history = useHistory()

    return (
        <Container fluid className='p-0'>
            <Navbar variant="dark" bg="dark">
                <Container fluid className='d-flex justify-content-between'>
                    <Navbar.Brand href='/dashboard'>Assignment Tracker</Navbar.Brand>
                    <Button variant='outline-light' onClick={() => redirectToDashboard(history)}>
                        Dashboard
                        <ArrowBarLeft className='ms-2' />
                    </Button>
                </Container>
            </Navbar>
            <Container fluid>
                <Row className='p-2 justify-content-center'>
                    <Col className='p-1 bg-light rounded-3' style={{ minHeight: '92vh' }}>
                        <div className="w-100 h-100 p-2">
                            <Tab.Container defaultActiveKey="info" transition={false}>
                                <Row className="h-100">
                                    <Col sm={2} className="border-end" >
                                        <Nav variant="pills" className="flex-column">
                                            <Nav.Item>
                                                <Nav.Link eventKey="info" disabled={props.isLoading}>Account Info</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Nav.Link eventKey="email" disabled={props.isLoading}>Change Email Address</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="username" disabled={props.isLoading}>Change Username</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="password" disabled={props.isLoading}>Change Password</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Button className="w-100 mb-2" variant="secondary" onClick={() => props.logoutUser()} disabled={props.isLoading}>Logout</Button>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Button className="w-100" variant="warning" onClick={() => props.logoutUserAllDevices()} disabled={props.isLoading}>Logout of all Devices</Button>
                                            </Nav.Item>
                                            <hr />
                                            <Nav.Item>
                                                <Nav.Link eventKey="delete" disabled={props.isLoading}>Delete Account</Nav.Link>
                                            </Nav.Item>
                                            <hr />
                                        </Nav>
                                    </Col>
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
                                </Row>
                            </Tab.Container>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

const redirectToDashboard = (history) => {
    history.push('/dashboard')
}

const mapStateToProps = state => ({
    email_address: state.account.email_address,
    username: state.account.username,
    date_registered: state.account.date_registered,
    isLoading: state.account.isLoading
})

const mapDispatchToProps = {
    changeEmailAddress,
    changeUsername,
    changePassword,
    logoutUser,
    logoutUserAllDevices,
    deleteAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);