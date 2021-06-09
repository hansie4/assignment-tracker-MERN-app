import { connect } from 'react-redux'

import { deleteAccount } from '../../../actions/accountActions'

import { clearError } from '../../../actions/errorActions'

import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

import { Trash } from 'react-bootstrap-icons'

function DeletePanel(props) {
    return (
        <div className="p-3">
            <h1>Delete Account</h1>
            <hr />
            <h3>This will permenantly delete your account and all of your tracker info.</h3>
            <br />
            <div className="d-flex justify-content-center">
                {
                    props.isLoading ?
                        <Button variant="danger" className="w-50" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                        :
                        <Button variant="danger" className="w-50" onClick={() => deleteSubmit(props.changeUsername, props.clearError)}>
                            DELETE ACCOUNT
                            <Trash className='ms-2' />
                        </Button>
                }
            </div>
        </div >
    )
}

const deleteSubmit = (deleteMethod, clearErrorMethod) => {
    clearErrorMethod()
    deleteMethod()
}

const mapStateToProps = state => ({
    isLoading: state.account.isLoading
})

const mapDispatchToProps = {
    deleteAccount,
    clearError
}

export default connect(mapStateToProps, mapDispatchToProps)(DeletePanel);