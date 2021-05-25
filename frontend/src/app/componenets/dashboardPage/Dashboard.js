import { connect } from 'react-redux'

import { logoutUser, deleteUser } from '../../actions/authActions'

function Dashboard(props) {
    return (
        <div>
            <h1>DASHBOARD</h1>
            <p>{JSON.stringify(props)}</p>
            <button onClick={() => props.logoutUser()}>logout</button>
            <button onClick={() => props.deleteUser()}>delete</button>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error
})

const mapDispatchToProps = {
    logoutUser,
    deleteUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);