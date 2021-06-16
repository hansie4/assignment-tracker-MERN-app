import { useState } from 'react'

import { connect } from 'react-redux'

import { selectClass } from '../../../actions/trackerActions'

import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import { PlusCircle } from 'react-bootstrap-icons'

import AddClassModal from './modals/AddClassModal'

function ClassSelectPanel({
    classes,
    selectClass,
    selected_class_id
}) {

    const [addClassModalShown, setAddClassModalShown] = useState(false)


    return (
        <div>
            <AddClassModal show={addClassModalShown} close={() => setAddClassModalShown(false)} />
            <Card className='border border-dark'>
                <Card.Header>
                    <Card.Title className='m-0'>Classes:</Card.Title>
                </Card.Header>
                <Card.Body className='p-0'>
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
                        <Button variant='light' onClick={() => setAddClassModalShown(true)}><PlusCircle /></Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </div>
    )
}

const mapStateToProps = state => ({
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    selectClass
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassSelectPanel)