import { connect } from 'react-redux'

function InfoPanel(props) {
    return (
        <div className="p-3">
            <h1>Account Info</h1>
            <hr />
            <p className="fs-4">Username: {props.username}</p>
            <p className="fs-4">Email Address: {props.email_address}</p>
            <p className="fs-4">Date Registered: {props.date_registered}</p>
        </div>
    )
}

const mapStateToProps = state => ({
    email_address: state.account.email_address,
    username: state.account.username,
    date_registered: state.account.date_registered
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPanel)