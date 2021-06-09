import { useState } from 'react'

import { connect } from 'react-redux'
import { loginUser } from '../../actions/authActions'
import {
    setError,
    clearError
} from '../../actions/errorActions'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

import { BoxArrowInRight } from 'react-bootstrap-icons'

function LoginPage(props) {

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Container fluid className='h-100'>
            <Row className='h-100 justify-content-center'>
                <Col sm={7} md={5} lg={4} xl={4} className='pt-5 pb-5'>
                    <Card>
                        <Card.Header as='h3' className='text-center'>Assignment Tracker Login</Card.Header>
                        <Card.Body>
                            <Form noValidate onSubmit={(event) => login(event, username, password, props.loginUser, props.setError)}>
                                <Form.Group>
                                    <Form.Label>Email/Username</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter email address or username here'
                                        onChange={(event) => handleChange(event, setUsername, props.clearError)}
                                        disabled={props.isLoading}
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        className='mb-2'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Enter your password here'
                                        onChange={(event) => handleChange(event, setPassword, props.clearError)}
                                        disabled={props.isLoading}
                                    />
                                    <Form.Check type='checkbox' label='Show password' onChange={(event) => setShowPassword(event.target.checked)} />
                                </Form.Group>
                                <br />
                                {
                                    props.error ?
                                        <Alert variant='danger'>{props.error.message}</Alert> :
                                        null
                                }
                                <Form.Group className='d-flex justify-content-end'>
                                    <Button type='submit' disabled={props.isLoading} className='w-100'>
                                        {
                                            props.isLoading ?
                                                <Spinner animation='border' size='sm' /> :
                                                <span>Login<BoxArrowInRight className='ms-2' size={20} /></span>
                                        }
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer className='d-flex justify-content-between'>
                            <a href='/register'>Dont have an account?</a>
                            <a href='/recover'>Forgot password?</a>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const login = (event, username, password, loginMethod, setErrorMethod) => {
    event.preventDefault()
    if (!username) {
        setErrorMethod(null, 'Username is required')
    } else if (!password) {
        setErrorMethod(null, 'Password is required')
    } else {
        loginMethod({ username, password })
    }
}

const handleChange = (event, setMethod, clearErrorMethod) => {
    clearErrorMethod()
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading,
    error: state.error.error
})

const mapDispatchToProps = {
    loginUser,
    setError,
    clearError,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)