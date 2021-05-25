import { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import { registerUser } from '../../actions/authActions'
import { clearError } from '../../actions/errorActions'

function RegisterPage(props) {

    let history = useHistory()

    const [email_address, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    return (
        <div>
            <h1>REGISTER PAGE</h1>
            <input type='text' onChange={(event) => handleChange(event, setEmail)} />
            <input type='text' onChange={(event) => handleChange(event, setUsername)} />
            <input type='password' onChange={(event) => handleChange(event, setPassword)} />
            <button onClick={() => register(email_address, username, password, props.registerUser())}>REGISTER</button>
            <h2>{props.error ? JSON.stringify(props.error.message) : null}</h2>
            <button onClick={() => history.push('/login')}>Register new account</button>
        </div>
    )
}

function handleChange(event, setMethod) {
    setMethod(event.target.value)
}

function register(email_address, username, password, registerMethod) {
    registerMethod(email_address, username, password)
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error.error
})

const mapDispatchToProps = {
    registerUser,
    clearError,
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);