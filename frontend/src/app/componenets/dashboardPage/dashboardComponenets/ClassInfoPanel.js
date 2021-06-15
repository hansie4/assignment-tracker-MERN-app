import {
    useState,
    useEffect
} from 'react'

import { connect } from 'react-redux'

import {
    getSelectedClassInfo,
    modifyClass,
    deleteClass
} from '../../../actions/trackerActions'

import Card from 'react-bootstrap/Card'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

import { GearFill, TrashFill, XCircleFill, CheckCircleFill } from 'react-bootstrap-icons'

function ClassInfoPanel({
    getSelectedClassInfo,
    modifyClass,
    deleteClass,
    selected_semester_id,
    selected_class_id
}) {

    const [class_, setClass] = useState(null)
    const [modifyMode, setModifyMode] = useState(false)

    const [new_name, setNewName] = useState(null)
    const [new_description, setNewDescription] = useState(null)

    useEffect(() => {
        setClass(getSelectedClassInfo())
        setModifyMode(false)
    }, [getSelectedClassInfo, selected_class_id, selected_semester_id])


    if (class_) {
        return (
            <Card className='border border-dark'>
                <Card.Header className='d-flex justify-content-between p-1 ps-3'>
                    {
                        modifyMode ?
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>New Class Name:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl placeholder={class_.name} onChange={(event) => handleChange(event, setNewName)} />
                            </InputGroup>
                            :
                            <h3>{class_.name}</h3>
                    }
                    <ButtonGroup size="sm">
                        <Button variant='secondary' onClick={() => setModifyMode(!modifyMode)}><GearFill /></Button>
                        <Button variant='danger' onClick={() => deleteClass({ class_id: selected_class_id, semester_id: selected_semester_id })}><TrashFill /></Button>
                    </ButtonGroup>
                </Card.Header>
                <Card.Body>
                    <Card.Title>Description:</Card.Title>
                    {
                        modifyMode ?
                            <InputGroup className='mb-3'>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>New Description:</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl placeholder={class_.description} onChange={(event) => handleChange(event, setNewDescription)} />
                            </InputGroup>
                            :
                            <Card.Text>{class_.description}</Card.Text>
                    }
                </Card.Body>
                {
                    modifyMode ?
                        <Card.Footer>
                            <ButtonGroup className='w-100'>
                                <Button variant='secondary' onClick={() => setModifyMode(false)}><XCircleFill /></Button>
                                <Button variant='success' onClick={() => modifyClass({ class_id: selected_class_id, semester_id: selected_semester_id, new_name, new_description })}><CheckCircleFill /></Button>
                            </ButtonGroup>
                        </Card.Footer>
                        :
                        null
                }
            </Card>
        )
    } else {
        return (
            <div></div>
        )
    }
}

const handleChange = (event, setMethod) => {
    setMethod(event.target.value)
}

const mapStateToProps = state => ({
    selected_semester_id: state.tracker.selected_semester_id,
    selected_class_id: state.tracker.selected_class_id
})

const mapDispatchToProps = {
    getSelectedClassInfo,
    modifyClass,
    deleteClass
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInfoPanel)