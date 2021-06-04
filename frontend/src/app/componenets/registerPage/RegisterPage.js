import { useState } from 'react'

import { connect } from 'react-redux'
import { registerUser } from '../../actions/authActions'
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

import { FileEarmarkPersonFill } from 'react-bootstrap-icons'

function RegisterPage(props) {

    const [email_address, setEmail] = useState(null)
    const [email_address_confirm, setEmailConfirm] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [password_confirm, setPasswordConfirm] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Container fluid className='h-100'>
            <Row className='h-100 justify-content-center'>
                <Col sm={7} md={5} lg={4} xl={4} className='pt-5 pb-5'>
                    <Card>
                        <Card.Header as='h3' className='text-center'>Register New Assignment Tracker Account</Card.Header>
                        <Card.Body>
                            <Form noValidate>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter email address here'
                                        onChange={(event) => handleChange(event, setEmail, props.clearError)}
                                        disabled={props.isLoading}
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Confirm Email</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Confirm email address here'
                                        onChange={(event) => handleChange(event, setEmailConfirm, props.clearError)}
                                        disabled={props.isLoading}
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter username here'
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
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        className='mb-2'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Confirm your password here'
                                        onChange={(event) => handleChange(event, setPasswordConfirm, props.clearError)}
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
                                <Form.Group>
                                    <Button className='w-100' onClick={() => register(email_address, email_address_confirm, username, password, password_confirm, props.registerUser, props.setError)}>
                                        {
                                            props.isLoading ?
                                                <Spinner animation='border' size='sm' /> :
                                                <span>Register<FileEarmarkPersonFill className='ms-2' size={20} /></span>
                                        }
                                    </Button>
                                    <Form.Text className='text-muted'>By creating an account you accept cookies from this website.</Form.Text>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            <a href='/login'>Already have an account?</a>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const register = (email_address, email_address_confirm, username, password, password_confirm, registerMethod, setErrorMethod) => {
    if (!email_address) {
        setErrorMethod(null, 'Email address is required')
    } else if (!email_address_confirm) {
        setErrorMethod(null, 'Email address confirmation is required')
    } else if (email_address !== email_address_confirm) {
        setErrorMethod(null, 'Emails must match')
    } else if (!username) {
        setErrorMethod(null, 'Username is required')
    } else if (!password) {
        setErrorMethod(null, 'Password is required')
    } else if (!password_confirm) {
        setErrorMethod(null, 'Password confirmation is required')
    } else if (password !== password_confirm) {
        setErrorMethod(null, 'Passwords must match')
    } else {
        registerMethod({ email_address, username, password })
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
    registerUser,
    setError,
    clearError,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);