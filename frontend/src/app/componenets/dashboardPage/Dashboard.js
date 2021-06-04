import { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import {
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices
} from '../../actions/accountActions'

import { refreshToken } from '../../actions/authActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons'

function Dashboard({
    auth,
    error,
    account,
    refreshToken,
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices
}) {

    let history = useHistory()

    useEffect(() => {
        getAccountInfo()
    }, [getAccountInfo])

    return (
        <Container fluid className='p-0'>
            <Navbar variant="dark" bg="dark">
                <Container fluid className='d-flex justify-content-between'>
                    <Navbar.Brand href='/dashboard'>Assignment Tracker</Navbar.Brand>
                    <ButtonGroup>
                        <Button variant='outline-light' onClick={() => redirectToAccountPage(history)}>
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
                    <Col className='bg-light rounded-3'>
                        <h1>DASHBOARD</h1>
                        <div className='text-break'>
                            {JSON.stringify(auth)}
                        </div>
                        <div className='text-break'>
                            {JSON.stringify(error)}
                        </div>
                        <div className='text-break'>
                            {JSON.stringify(account)}
                        </div>
                        <Button onClick={() => logoutUserAllDevices()}>LOGOUT ALL</Button>
                        <Button onClick={() => refresh(refreshToken)}>REFRESH</Button>
                    </Col>
                </Row>
            </Container>
        </Container>

    )
}

const refresh = async (fun) => {
    const test = await fun()
    console.log(test)
}

const redirectToAccountPage = (history) => {
    history.push('/account')
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error,
    account: state.account
})

const mapDispatchToProps = {
    refreshToken,
    getAccountInfo,
    logoutUser,
    logoutUserAllDevices
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);