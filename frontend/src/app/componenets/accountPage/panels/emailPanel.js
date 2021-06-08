import { useState } from 'react'

import { connect } from 'react-redux'

import { changeEmailAddress } from '../../../actions/accountActions'

import {
    setError,
    clearError
} from '../../../actions/errorActions'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

import { Save } from 'react-bootstrap-icons'

function EmailPanel(props) {

    const [new_email_address, setNewEmail] = useState(null)
    const [new_email_address_confirm, setNewEmailConfirm] = useState(null)

    return (
        <div className="p-3">
            <h1>Change Account Email Address</h1>
            <hr />
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Current Email Address:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={props.email_address} disabled />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>New Email Address:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={(event) => handleChange(event, setNewEmail, props.clearError)} disabled={props.isLoading} />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Confirm New Email Address:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={(event) => handleChange(event, setNewEmailConfirm, props.clearError)} disabled={props.isLoading} />
            </InputGroup>
            {
                props.error ?
                    <Alert variant="warning">{props.error.message}</Alert>
                    :
                    null
            }
            <div className="d-flex justify-content-center">
                {
                    props.isLoading ?
                        <Button variant="success" className="w-50" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                        :
                        <Button variant="success" className="w-50" onClick={() => newEmailSubmit(new_email_address, new_email_address_confirm, props.changeEmailAddress, props.setError, props.clearError)}>
                            Save Changes
                            <Save className='ms-2' />
                        </Button>
                }
            </div>
        </div >
    )
}

const newEmailSubmit = (new_email_address, new_email_address_confirm, changeEmailMethod, setErrorMethod, clearErrorMethod) => {
    if (!new_email_address) {
        setErrorMethod(null, 'New email address required')
    } else if (!(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(new_email_address))) {
        setErrorMethod(null, 'Invalid email address format')
    } else if (!new_email_address_confirm) {
        setErrorMethod(null, 'Must confirm new email address')
    } else if (new_email_address !== new_email_address_confirm) {
        setErrorMethod(null, 'Email addresses do not match')
    } else {
        clearErrorMethod()
        changeEmailMethod({ new_email_address })
    }
}

const handleChange = (event, setMethod, clearErrorMethod) => {
    clearErrorMethod()
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    email_address: state.account.email_address,
    isLoading: state.account.isLoading,
    error: state.error.error
})

const mapDispatchToProps = {
    changeEmailAddress,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailPanel);