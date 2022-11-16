import React, { useState, useEffect } from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, UncontrolledAlert, Alert } from 'reactstrap';

import styles from '../styles/project-style.css';

function APIResponseErrorMessage(props) {
    const [error, setError] = useState(props.error);
    const [errorStatus, setErrorStatus] = useState(props.errorStatus);
    const [collapseForm, setCollapseForm] = useState(false);

    useEffect(() => {
        setError(props.error);
        setErrorStatus(props.errorStatus);
    }, [props.error, props.errorStatus]);

    function toggleForm() {
        setCollapseForm((collapseForm) => (!collapseForm));
    }

    return (
        <div>
            <Alert color="danger" key={error.message}>
                {error.message}
                {errorStatus > 1 && <Button color="link" onClick={toggleForm}>Details...</Button>}
            </Alert>

            {errorStatus > 1 &&
                <Modal isOpen={collapseForm} toggle={toggleForm}
                    className={props.className}>
                    <ModalHeader toggle={toggleForm} className={styles.errorTitle}> Server side error information: </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs="3"> Time: </Col>   <Col xs="auto" className={styles.errorText}>{error.timestamp} </Col>
                        </Row>
                        <Row>
                            <Col xs="3"> Resource : </Col>   <Col xs="auto" className={styles.errorText}>{error.resource} </Col>
                        </Row>
                        <Row>
                            <Col xs="3"> Error : </Col>   <Col xs="auto" className={styles.errorText}>{error.status} - {error.error} </Col>
                        </Row>
                        <Row>
                            <Col xs="3"> Message : </Col>   <Col xs="auto" className={styles.errorText}>{error.message} </Col>
                        </Row>
                        <Row>
                            <Col xs="3"> Path : </Col>   <Col xs="auto" className={styles.errorText}>{error.path} </Col>
                        </Row>
                        <Row>
                            <Col xs="3"> Details : </Col>   <Col xs="auto" className={styles.errorText}>
                                {error.details}
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={toggleForm}>Cancel</Button>
                    </ModalFooter>
                </Modal>}
        </div>
    );
}

export default APIResponseErrorMessage;