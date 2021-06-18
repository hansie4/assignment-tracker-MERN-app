import { useState } from 'react'

import { connect } from 'react-redux'

import { selectClass } from '../../../actions/trackerActions'

import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import { PlusCircle } from 'react-bootstrap-icons'

import AddClassModal from './AddClassModal'

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
                                            onClick={() => {
                                                if (current_class._id !== selected_class_id) {
                                                    selectClass(current_class._id)
                                                }
                                            }}
                                            variant={(current_class._id === selected_class_id) ? 'dark' : 'outline-dark'}
                                            className='w-100'
                                        >
                                            {current_class.name}
                                        </Button>
                                    )
                                })
                                :
                                null
                        }
                    </ButtonGroup>
                </Card.Body>
                <Card.Footer className='p-0'>
                    <Button block variant='light' onClick={() => setAddClassModalShown(true)}><PlusCircle /></Button>
                </Card.Footer>
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