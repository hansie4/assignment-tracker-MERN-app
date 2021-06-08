import { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import { getAccountInfo } from '../../actions/accountActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons'

function Dashboard({
    error,
    getAccountInfo,
    logoutUser
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
                    <Col className='p-2 bg-light rounded-3' style={{ minHeight: '92vh' }}>

                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

const redirectToAccountPage = (history) => {
    history.push('/account')
}

const mapStateToProps = state => ({
    error: state.error
})

const mapDispatchToProps = {
    getAccountInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);