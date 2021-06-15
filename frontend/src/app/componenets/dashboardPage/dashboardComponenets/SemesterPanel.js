import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ClassSelectPanel from "./ClassSelectPanel"
import ClassInfoPanel from "./ClassInfoPanel"

function SemesterPanel(props) {
    return (
        <Container fluid>
            <Row>
                <Col lg={9}>
                    <ClassInfoPanel />
                </Col>
                <Col lg={3}>
                    <ClassSelectPanel />
                </Col>
            </Row>
        </Container>
    )
}

export default SemesterPanel