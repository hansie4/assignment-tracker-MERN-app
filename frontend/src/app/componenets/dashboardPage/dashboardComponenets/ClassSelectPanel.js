import {
    useState,
    useEffect
} from 'react'

import { connect } from 'react-redux'

import {
    getSelectedSemesterInfo,
    selectClass
} from '../../../actions/trackerActions'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import { PlusCircle } from 'react-bootstrap-icons'

import AddClassModal from './modals/AddClassModal'

function ClassSelectPanel({
    getSelectedSemesterInfo,
    selectClass,
    selected_semester_id,
    selected_class_id
}) {

    const [classes, setClasses] = useState(null)
    const [addClassModalShown, setAddClassModalShown] = useState(false)

    useEffect(() => {
        setClasses(getSelectedSemesterInfo().classes)
    }, [getSelectedSemesterInfo, selected_semester_id])

    return (
        <div>
            <AddClassModal show={addClassModalShown} close={() => setAddClassModalShown(false)} />
            <div className='w-100 border border-dark rounded bg-light'>
                <h5 className='text-center pt-2 m-0 pb-2 border-bottom border-dark rounded'>Classes:</h5>
                <ButtonGroup vertical className='w-100'>
                    {
                        classes ?
                            classes.map((current_class, index) => {
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => selectClass(current_class._id)}
                                        disabled={current_class._id === selected_class_id}
                                        className='w-100'
                                    >
                                        {current_class.name}
                                    </Button>
                                )
                            })
                            :
                            null
                    }
                    <Button variant='light' className='border-top border-dark' onClick={() => setAddClassModalShown(true)}><PlusCircle /></Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    getSelectedSemesterInfo,
    selectClass
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassSelectPanel)