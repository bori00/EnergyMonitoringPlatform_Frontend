import React, {useEffect, Fragment, useState, Form} from 'react';
import {
    Alert,
    Button,
    Col,
    Modal, ModalBody, ModalFooter, ModalHeader, Row,
    FormGroup, Label, Input
} from 'reactstrap';
import Select from 'react-select'

import * as API_DEVICES from "./api/admin-device-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import styles from "../commons/styles/project-style.css";
import Validate from "../commons/validators/validators";

let formControlsInit = {
    name: {
        value: '',
        placeholder: 'Device name...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true,
            minLength: 3
        },
        errorMessages: []
    },
    userName: {
        value: '',
        placeholder: 'Owner name...',
        possibleValues: null,
        valid: false,
        validationRules: {
        },
    }
};

function getValueLabelDictionary(v) {
    return { value: v, label: v }
}

function ManageDeviceModal(props) {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [device, setDevice] = useState(props.device);
    const [success, setSuccess] = useState(0);
    const [formControls, setFormControls] = useState(formControlsInit);
    const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {

        const getAllClientsCallback = (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                let newFormControls = JSON.parse(JSON.stringify(formControls));

                newFormControls.userName.possibleValues = [];
                result.forEach(client => {
                    newFormControls.userName.possibleValues.push(getValueLabelDictionary(client.userName));
                });

                newFormControls.name.value = device.name;
                newFormControls.name.valid = true;
                newFormControls.userName.value = device.userName;
                newFormControls.userName.valid = true;

                setFormControls(newFormControls);

                setFormIsValid(true);

            } else {
                setError({ status: err.status, errorMessage: err });
            }
        }

        API_DEVICES.getAllClients(getAllClientsCallback);
    }, [])

    function closeModal() {
        props.onClose();
    }

    function deleteDevice() {
        if (window.confirm("Are you sure you want to delete device " + device.name + "?")) {
            const callback = (err) => {
                if (err === null) {
                    setSuccess(1);
                } else {
                    setError({ status: err.status, errorMessage: err });
                }
            };

            API_DEVICES.deleteDevice(callback, device.id);
        }
    }

    function updateDevice(name, userName) {
        if (window.confirm("Are you sure you want to update device " + device.name + "?")) {
            const callback = (err) => {
                if (err === null) {
                    setSuccess(1);
                } else {
                    console.log(err)
                    setError({ status: err.status, errorMessage: err });
                }
            };

            API_DEVICES.updateDevice(callback, device.id, name, userName);
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

    function handleOwnerChange(e) {
        let name = "userName";
        let value = e.value;

        handleFormChange(name, value);
    }

    function handleSubmit() {
        updateDevice(formControls.name.value, formControls.userName.value)
    }

    return (
        <Modal isOpen>
            <ModalHeader>Update Device Data for <b>{device.name}</b></ModalHeader>
            <ModalBody>
                { success === 0 && error.status === 0 &&
                    <Fragment>
                        <FormGroup id='name'>
                            <Label for='nameField'>Device name: </Label>
                            <Input name='name' id='nameField' placeholder={formControls.name.placeholder}
                                   onChange={handleChange}
                                   defaultValue={formControls.name.value}
                                   touched={formControls.name.touched ? 1 : 0}
                                   valid={formControls.name.valid}
                                   required
                            />
                            {formControls.name.touched && !formControls.name.valid &&
                            <div className={"error-message"}>{formControls.name.errorMessages.join('. ')}</div>}
                        </FormGroup>

                        <FormGroup id='owner'>
                            <Label for='ownerField'>Owner: </Label>
                            <Select options={formControls.userName.possibleValues}
                                    name="ownerField"
                                    defaultValue={getValueLabelDictionary(formControls.userName.value)}
                                    isClearable={0}
                                    onChange={handleOwnerChange}
                            />
                        </FormGroup>

                        <Row>
                            <Col sm={{ size: '4', offset: 8 }}>
                                <Button type={"submit"} disabled={!formIsValid} onClick={handleSubmit}>Save Changes</Button>
                            </Col>
                        </Row>

                        <Button color="danger" onClick={deleteDevice}>Delete Device</Button>
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

export default ManageDeviceModal;
