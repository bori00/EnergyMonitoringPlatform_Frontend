

import React, {useEffect, Fragment, useState, Form} from 'react';
import {
    Alert,
    Button,
    Col,
    Modal, ModalBody, ModalFooter, ModalHeader, Row,
    FormGroup, Label, Input
} from 'reactstrap';
import Select from 'react-select'

import * as API_USERS from "./api/admin-user-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import styles from "../commons/styles/project-style.css";
import Validate from "../commons/validators/validators";
import * as API_AUTH from "../commons/authentication/auth-api";

let formControlsInit = {
    userName: {
        value: '',
        placeholder: 'Username...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true,
            minLength: 3
        },
        errorMessages: []
    },
    emailAddress: {
        value: '',
        placeholder: 'Email address...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true,
            minLength: 3,
            email: true,
        },
        errorMessages: []
    }
};

function ManageUserModal(props) {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [user, setUser] = useState(props.user);
    const [success, setSuccess] = useState(0);
    const [formControls, setFormControls] = useState(formControlsInit);
    const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {
        let newFormControls = JSON.parse(JSON.stringify(formControls));

        newFormControls.userName.value = user.userName;
        newFormControls.userName.valid = true;
        newFormControls.emailAddress.value = user.emailAddress;
        newFormControls.emailAddress.valid = true;

        setFormControls(newFormControls);

        setFormIsValid(true);
    }, [error])

    function closeModal() {
        props.onClose();
    }

    function deleteUser() {
        if (window.confirm("Are you sure you want to delete user " + user.userName + "?")) {
            const callback = (err) => {
                if (err === null) {
                    setSuccess(1);
                } else {
                    setError({ status: err.status, errorMessage: err });
                }
            };

            API_USERS.deleteUser(callback, user.id);
        }
    }

    function updateUser(userName, emailAddress) {
        if (window.confirm("Are you sure you want to update user " + user.userName + "?")) {
            const callback = (err) => {
                if (err === null) {
                    setSuccess(1);
                } else {
                    console.log(err)
                    setError({ status: err.status, errorMessage: err });
                }
            };

            API_USERS.updateUser(callback, user.id, userName, user.password, emailAddress);
        }
    }

    function handleFormChange(name, value) {
        let updatedControls = { ...formControls };

        let updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;

        const validation_result = Validate(value, updatedFormElement.validationRules);
        updatedFormElement.valid = validation_result.valid;
        updatedFormElement.errorMessages = validation_result.errorMessages;
        updatedControls[name] = updatedFormElement;

        console.log(updatedControls)

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        setFormControls((formControls) => (updatedControls));
        setFormIsValid((formIsValidPrev) => (formIsValid));
    }

    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        handleFormChange(name, value);
    }

    function handleSubmit() {
        updateUser(formControls.userName.value, formControls.emailAddress.value)
    }

    return (
        <Modal isOpen>
            <ModalHeader>Update User Data for <b>{user.userName}</b></ModalHeader>
            <ModalBody>
                { success === 0 && error.status === 0 &&
                <Fragment>
                    <FormGroup id='userName'>
                        <Label for='userNameField'>Username: </Label>
                        <Input name='userName' id='userNameField' placeholder={formControls.userName.placeholder}
                               onChange={handleChange}
                               defaultValue={formControls.userName.value}
                               touched={formControls.userName.touched ? 1 : 0}
                               valid={formControls.userName.valid}
                               required
                        />
                        {formControls.userName.touched && !formControls.userName.valid &&
                        <div className={"error-message"}>{formControls.userName.errorMessages.join('. ')}</div>}
                    </FormGroup>

                    <FormGroup id='emailAddress'>
                        <Label for='Field'>Email address: </Label>
                        <Input name='emailAddress' id='emailAddressField' placeholder={formControls.emailAddress.placeholder}
                               onChange={handleChange}
                               defaultValue={formControls.emailAddress.value}
                               touched={formControls.emailAddress.touched ? 1 : 0}
                               valid={formControls.emailAddress.valid}
                               required
                        />
                        {formControls.emailAddress.touched && !formControls.emailAddress.valid &&
                        <div className={"error-message"}>{formControls.emailAddress.errorMessages.join('. ')}</div>}
                    </FormGroup>

                    <Row>
                        <Col sm={{ size: '4', offset: 8 }}>
                            <Button type={"submit"} disabled={!formIsValid} onClick={handleSubmit}>Save Changes</Button>
                        </Col>
                    </Row>

                    <Button color="danger" onClick={deleteUser}>Delete User</Button>
                </Fragment>
                }
                {
                    success === 1 &&
                    <Fragment>
                        <Alert color="success">
                            Successful update!
                        </Alert>
                    </Fragment>
                }
                {
                    error.status > 0 &&
                    <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
                }

            </ModalBody>
            <ModalFooter>
                <Button color="white" onClick={closeModal}>Exit</Button>
            </ModalFooter>
        </Modal>

    );

}

export default ManageUserModal;
