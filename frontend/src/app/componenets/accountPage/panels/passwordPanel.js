import { useState } from 'react'

import { connect } from 'react-redux'

import { changePassword } from '../../../actions/accountActions'

import {
    setError,
    clearError
} from '../../../actions/errorActions'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { Save } from 'react-bootstrap-icons'
import { Eye } from 'react-bootstrap-icons'
import { EyeSlash } from 'react-bootstrap-icons'

function PasswordPanel(props) {

    const [new_password, setPassword] = useState(null)
    const [new_password_confirm, setPasswordConfirm] = useState(null)
    const [passwordShown, setShown] = useState(false)
    const [passwordConfirmShown, setConfirmShown] = useState(false)

    return (
        <div className="p-3">
            <h1>Change Account Password</h1>
            <hr />
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>New Password:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type={passwordShown ? "text" : "password"} onChange={(event) => handleChange(event, setPassword)} disabled={props.isLoading} />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={() => setShown(!passwordShown)}>{passwordShown ? <EyeSlash /> : <Eye />}</Button>
                </InputGroup.Append>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text>Confirm New Password:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type={passwordConfirmShown ? "text" : "password"} onChange={(event) => handleChange(event, setPasswordConfirm)} disabled={props.isLoading} />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={() => setConfirmShown(!passwordConfirmShown)}>{passwordConfirmShown ? <EyeSlash /> : <Eye />}</Button>
                </InputGroup.Append>
            </InputGroup>
            <div className="d-flex justify-content-center">
                {
                    props.isLoading ?
                        <Button variant="success" className="w-50" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                        :
                        <Button variant="success" className="w-50" onClick={() => newPasswordSubmit(new_password, new_password_confirm, props.changePassword, props.setError, props.clearError)}>
                            Save Changes
                            <Save className='ms-2' />
                        </Button>
                }
            </div>
        </div >
    )
}

const newPasswordSubmit = (new_password, new_password_confirm, changePasswordMethod, setErrorMethod, clearErrorMethod) => {
    if (!new_password) {
        setErrorMethod(null, 'New password required')
    } else if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,256}$/.test(new_password))) {
        setErrorMethod(null, 'Password must be atleast 8 characters and contain one of each: lowercase letter, uppercase letter, number, and symbol')
    } else if (!new_password_confirm) {
        setErrorMethod(null, 'Must confirm new password')
    } else if (new_password !== new_password_confirm) {
        setErrorMethod(null, 'Passwords do not match')
    } else {
        clearErrorMethod()
        changePasswordMethod({ new_password })
    }
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    isLoading: state.account.isLoading,
})

const mapDispatchToProps = {
    changePassword,
    setError,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPanel);