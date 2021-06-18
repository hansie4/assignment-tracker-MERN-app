import { useState } from 'react'

import { connect } from 'react-redux'

import { recoveryEmail } from '../../actions/authActions'
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

function RecoveryPage(props) {

    const [email_address, setEmail] = useState(null)
    const [emailSent, setEmailSent] = useState(false)

    return (
        <Container fluid className='h-100'>
            <Row className='h-100 justify-content-center'>
                <Col sm={7} md={5} lg={4} xl={4} className='pt-5 pb-5'>
                    <Card>
                        <Card.Header as='h3' className='text-center'>Assignment Tracker Password Recovery</Card.Header>
                        <Card.Body>
                            <Form noValidate>
                                <Form.Group>
                                    <Form.Label>Email for Account to Recover</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter email address here'
                                        onChange={(event) => handleChange(event, setEmail, props.error, props.clearError)}
                                        disabled={props.isLoading || emailSent}
                                    />
                                </Form.Group>
                                <br />
                                {
                                    props.error ?
                                        <Alert variant='danger'>{props.error.message}</Alert>
                                        :
                                        null
                                }
                                <Form.Group className='d-flex justify-content-end'>
                                    <Button onClick={() => submit(email_address, props.recoveryEmail, setEmailSent, props.setError)} disabled={props.isLoading} className='w-100'>
                                        {
                                            props.isLoading ?
                                                <Spinner animation='border' size='sm' />
                                                :
                                                <span>
                                                    {emailSent ? 'Resend Email' : 'Send Email'}
                                                    <Envelope className='ms-2' size={20} />
                                                </span>
                                        }
                                    </Button>
                                </Form.Group>
                                <Form.Text className='text-muted'>Make sure to check spam folder if you don't see the email immediately.</Form.Text>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            <a href='/login'>Ready to login?</a>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const submit = (email_address, recoverAccountMethod, setEmailSent, setErrorMethod) => {
    if (!email_address) {
        setErrorMethod(null, 'Email address is required')
    } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(email_address))) {
        setErrorMethod(null, 'Invalid email format')
    } else {
        recoverAccountMethod({ email_address })
        setEmailSent(true)
    }
}

const handleChange = (event, setMethod, error, clearErrorMethod) => {
    if (error) clearErrorMethod()
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading,
    error: state.error.error
})

const mapDispatchToProps = {
    recoveryEmail,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(RecoveryPage)