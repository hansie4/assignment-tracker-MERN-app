import { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import { loginUser } from '../../actions/authActions'
import { clearError } from '../../actions/errorActions'

function LoginPage(props) {

    let history = useHistory()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div>
            <h1>LOGIN PAGE</h1>
            <input type='text' onChange={(event) => handleChange(event, setUsername)} />
            <input type='password' onChange={(event) => handleChange(event, setPassword)} />
            <button onClick={() => login(username, password, props.loginUser())}>LOGIN</button>
            <h2>{props.error ? JSON.stringify(props.error.message) : null}</h2>
            <button onClick={() => history.push('/register')}>Register new account</button>
        </div>
    )
}

function handleChange(event, setMethod) {
    setMethod(event.target.value)
}

function login(username, password, loginMethod) {
    loginMethod(username, password)
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error.error
})

const mapDispatchToProps = {
    loginUser,
    clearError,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);