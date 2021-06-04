import { connect } from 'react-redux'


function AccountPage(props) {
    return (
        <h1>Account Page</h1>
    )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);