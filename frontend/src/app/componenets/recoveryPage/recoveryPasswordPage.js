import { useState } from 'react'

import { useParams } from 'react-router-dom'

import { connect } from 'react-redux'

import { changePassword } from '../../actions/accountActions'
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

import { Envelope } from 'react-bootstrap-icons'

function RecoveryPasswordPage(props) {

    let { accessToken } = useParams()

    const [new_password, setNewPassword] = useState(null)
    const [new_password_confirm, setNewPasswordConfirm] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Container fluid className='h-100'>
            <Row className='h-100 justify-content-center'>
                <Col sm={7} md={5} lg={4} xl={4} className='pt-5 pb-5'>
                    <Card>
                        <Card.Header as='h3' className='text-center'>Assignment Tracker Password Recovery</Card.Header>
                        <Card.Body>
                            <Form noValidate onSubmit={(event) => submit(event, new_password, new_password_confirm, accessToken, props.changePassword, props.setError)}>
                                <Form.Group>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        className='mb-2'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Enter your password here'
                                        onChange={(event) => handleChange(event, setNewPassword, props.clearError)}
                                        disabled={props.isLoading}
                                    />
                                </Form.Group>
                                <br />
                                <Form.Group>
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        className='mb-2'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Confirm your password here'
                                        onChange={(event) => handleChange(event, setNewPasswordConfirm, props.clearError)}
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
                                                <Envelope size={20} />
                                        }
                                    </Button>
                                </Form.Group>
                                <Form.Text className='text-muted'>Make sure to check spam folder if you don't see the email immediately.</Form.Text>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const submit = (event, new_password, new_password_confirm, accessToken, updatePasswordMethod, setErrorMethod) => {
    event.preventDefault()
    if (!new_password) {
        setErrorMethod(null, 'New password is required')
    } else if (!new_password_confirm) {
        setErrorMethod(null, 'New password confirmation is required')
    } else if (new_password !== new_password_confirm) {
        setErrorMethod(null, 'Passwords do not match')
    } else {
        updatePasswordMethod({ new_password, accessToken })
    }
}

const handleChange = (event, setMethod, clearErrorMethod) => {
    clearErrorMethod()
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading
})

const mapDispatchToProps = {
    changePassword,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(RecoveryPasswordPage)