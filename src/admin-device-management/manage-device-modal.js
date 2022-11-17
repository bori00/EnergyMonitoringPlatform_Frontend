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
    },
    maxHourlyConsumption: {
        value: "100",
        placeholder: 'Max hourly energy consumption...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true,
            minValue: 0
        },
        errorMessages: []
    },
    description: {
        value: null,
        placeholder: 'Description...',
        valid: false,
        touched: false,
        validationRules: {
            maxLength: 1000
        },
        errorMessages: []
    },
    address: {
        value: null,
        placeholder: 'Address...',
        valid: false,
        touched: false,
        validationRules: {
            maxLength: 200
        },
        errorMessages: []
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
                newFormControls.maxHourlyConsumption.value = device.maxEnergyConsumption;
                newFormControls.maxHourlyConsumption.valid = true;
                newFormControls.description.value = device.description;
                newFormControls.description.valid = true;
                newFormControls.address.value = device.address;
                newFormControls.address.valid = true;

                console.log(newFormControls.maxHourlyConsumption)

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

    function updateDevice(name, userName, maxHourlyConsumption, description, address) {
        if (window.confirm("Are you sure you want to update device " + device.name + "?")) {
            const callback = (err) => {
                if (err === null) {
                    setSuccess(1);
                } else {
                    console.log(err)
                    setError({ status: err.status, errorMessage: err });
                }
            };

            API_DEVICES.updateDevice(callback, device.id, name, userName, maxHourlyConsumption, description, address);
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
        updateDevice(formControls.name.value,
            formControls.userName.value,
            formControls.maxHourlyConsumption.value,
            formControls.description.value,
            formControls.address.value)
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
                                    value={getValueLabelDictionary(formControls.userName.value)}
                                    isClearable={0}
                                    onChange={handleOwnerChange}
                            />
                        </FormGroup>

                        <FormGroup id='maxHourlyEnergyConsumption'>
                            <Label for='consumptionField'>Maximum hourly energy consumption: </Label>
                            <Input name='maxHourlyConsumption' id='consumptionField' placeholder={formControls.maxHourlyConsumption.placeholder}
                                   onChange={handleChange}
                                   type="number"
                                   value={formControls.maxHourlyConsumption.value}
                                   touched={formControls.maxHourlyConsumption.touched ? 1 : 0}
                                   valid={formControls.maxHourlyConsumption.valid}
                                   min="0"
                                   required
                            />
                            {formControls.maxHourlyConsumption.touched && !formControls.maxHourlyConsumption.valid &&
                            <div className={"error-message"}>{formControls.maxHourlyConsumption.errorMessages.join('. ')}</div>}
                        </FormGroup>

                        <FormGroup id='description'>
                            <Label for='descriptionField'>Description: </Label>
                            <Input name='description' id='descriptionField' placeholder={formControls.description.placeholder}
                                   onChange={handleChange}
                                   type="textarea"
                                   defaultValue={formControls.description.value}
                                   touched={formControls.description.touched ? 1 : 0}
                                   valid={formControls.description.valid}
                                   required
                            />
                            {formControls.description.touched && !formControls.description.valid &&
                            <div className={"error-message"}>{formControls.description.errorMessages.join('. ')}</div>}
                        </FormGroup>

                        <FormGroup id='address'>
                            <Label for='addressField'>Address: </Label>
                            <Input name='address' id='addressField' placeholder={formControls.address.placeholder}
                                   onChange={handleChange}
                                   defaultValue={formControls.address.value}
                                   touched={formControls.address.touched ? 1 : 0}
                                   valid={formControls.address.valid}
                                   required
                            />
                            {formControls.address.touched && !formControls.address.valid &&
                            <div className={"error-message"}>{formControls.address.errorMessages.join('. ')}</div>}
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
