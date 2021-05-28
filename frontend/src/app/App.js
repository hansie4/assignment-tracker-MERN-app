import { useEffect } from 'react'

import {
	BrowserRouter,
	Switch,
	Route,
	Redirect
} from 'react-router-dom'

import { connect } from 'react-redux'

import { refreshToken } from './actions/authActions'
import { clearError } from './actions/errorActions'

import LoginPage from './componenets/loginPage/LoginPage'
import RegisterPage from './componenets/registerPage/RegisterPage'
import Dashboard from './componenets/dashboardPage/Dashboard'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

function App({
	isAuthenticated,
	isAuthLoading,
	refreshToken,
	clearError
}) {

	useEffect(() => {
		refreshToken()
			.then(() => {
				clearError()
			})
	}, [refreshToken, clearError])

	return (
		<Container fluid className='min-vh-100 h-100 p-0 bg-dark bg-gradient' style={{ height: '1px' }}>
			{
				isAuthLoading ?
					<Container className='pt-5'>
						<Row className='pt-5'>
							<Col className='pt-5 d-flex justify-content-center'>
								<Spinner animation="border" variant='light' style={{ width: '5rem', height: '5rem' }} />
							</Col>
						</Row>
					</Container>
					:
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
			}
		</Container>
	)
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	isAuthLoading: state.auth.isLoading
})

const mapDispatchToProps = {
	refreshToken,
	clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
