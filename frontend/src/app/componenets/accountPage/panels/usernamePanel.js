import { useState } from 'react'

import { connect } from 'react-redux'

import { changeUsername } from '../../../actions/accountActions'

import {
    setError,
    clearError
} from '../../../actions/errorActions'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { Save } from 'react-bootstrap-icons'

function UsernamePanel(props) {

    const [new_username, setUsername] = useState(null)
    const [new_username_confirm, setUsernameConfirm] = useState(null)

    return (
        <div className="p-3">
            <h1>Change Account Username</h1>
            <hr />
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Current Username:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={props.username} disabled />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>New Username:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={(event) => handleChange(event, setUsername)} disabled={props.isLoading} />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Confirm New Username:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={(event) => handleChange(event, setUsernameConfirm)} disabled={props.isLoading} />
            </InputGroup>
            <div className="d-flex justify-content-center">
                {
                    props.isLoading ?
                        <Button variant="success" className="w-50" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                        :
                        <Button variant="success" className="w-50" onClick={() => newUsernameSubmit(new_username, new_username_confirm, props.changeUsername, props.setError, props.clearError)}>
                            Save Changes
                            <Save className='ms-2' />
                        </Button>
                }
            </div>
        </div >
    )
}

const newUsernameSubmit = (new_username, new_username_confirm, changeUsernameMethod, setErrorMethod, clearErrorMethod) => {
    if (!new_username) {
        setErrorMethod(null, 'New username required')
    } else if (!(/^[a-zA-Z0-9_]{6,64}$/.test(new_username))) {
        setErrorMethod(null, 'Username must be 6 to 64 characters long and can only contain characters: a-z, A-Z, 0-9, and _')
    } else if (!new_username_confirm) {
        setErrorMethod(null, 'Must confirm new username')
    } else if (new_username !== new_username_confirm) {
        setErrorMethod(null, 'Usernames do not match')
    } else {
        clearErrorMethod()
        changeUsernameMethod({ new_username })
    }
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    username: state.account.username,
    isLoading: state.account.isLoading,
})

const mapDispatchToProps = {
    changeUsername,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernamePanel)