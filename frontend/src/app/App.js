import { useEffect } from 'react'

import {
	BrowserRouter,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'

import { connect } from 'react-redux'

import LoginPage from './componenets/loginPage/LoginPage'
import RegisterPage from './componenets/registerPage/RegisterPage'
import Dashboard from './componenets/dashboardPage/Dashboard'

import { authenticateUser } from './actions/authActions'
import { clearError } from './actions/errorActions'

import { Container } from 'react-bootstrap'

function App({ isAuthenticated, authenticateUser, clearError }) {

	useEffect(() => {
		authenticateUser()
			.then(() => {
				clearError()
			})
	}, [authenticateUser, clearError])

	return (
		<Container fluid className='min-vh-100 h-100 p-0 bg-dark bg-gradient' style={{ height: '1px' }}>
			<BrowserRouter>
				<Switch>
					<Route exact path='/login'>
						{isAuthenticated ? <Redirect to='/dashboard' /> : <LoginPage />}
					</Route>
					<Route exact path='/register'>
						{isAuthenticated ? <Redirect to='/dashboard' /> : <RegisterPage />}
					</Route>
					<Route exact path='/dashboard'>
						{isAuthenticated ? <Dashboard /> : <Redirect to='/login' />}
					</Route>
					<Route path='/'>
						{isAuthenticated ? <Redirect to='/dashboard' /> : <Redirect to='/login' />}
					</Route>
				</Switch>
			</BrowserRouter>
		</Container>
	)
}

const mapStateToProps = state => ({
	authToken: state.auth.authToken,
	isAuthenticated: state.auth.isAuthenticated
})

const mapDispatchToProps = {
	authenticateUser,
	clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
