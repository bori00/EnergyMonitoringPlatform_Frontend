import React, { useState, useEffect} from 'react';
import { Col, Row } from "reactstrap";
import { FormGroup, Input, Label } from 'reactstrap';
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_AUTH from "../commons/authentication/auth-api";
import Validate from "./validators/user-login-validators";
import * as API_SOCKET from "../commons/sockets/socket-utils";

const formControlsInit = {
    userName: {
        value: '',
        placeholder: 'Username...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true
        }
    },
    password: {
        value: '',
        placeholder: 'Password...',
        valid: false,
        touched: false,
        validationRules: {
            isRequired: true
        }
    }
};

function LoginForm() {
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [formIsValid, setFormIsValid] = useState(false);
    const [formControls, setFormControls] = useState(formControlsInit);
    const history = useHistory();

    function handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let updatedControls = { ...formControls };

        let updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = Validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        setFormControls((formControls) => (updatedControls));
        setFormIsValid((formIsValidPrev) => (formIsValid));
    }


    function login(userName, password) {
        const callback = (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                API_AUTH.setActiveUser(result, () => {
                    history.push("/");
                    window.location.reload();
                })
            } else {
                setError({ status: err.status, errorMessage: err });
            }
        };

        API_AUTH.login(callback, userName, password);
    }

    function handleSubmit() {
        login(formControls.userName.value, formControls.password.value);
    }

    return (
        <div>
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
                <div className={"error-message row"}> * Username must not be blank </div>}
            </FormGroup>

            <FormGroup id='password'>
                <Label for='Field'>Password: </Label>
                <Input name='password' id='passwordField' placeholder={formControls.password.placeholder}
                       onChange={handleChange}
                       defaultValue={formControls.password.value}
                       touched={formControls.password.touched ? 1 : 0}
                       valid={formControls.password.valid}
                       required
                       type="password"
                />
                {formControls.password.touched && !formControls.password.valid &&
                <div className={"error-message"}> * Password must not be blank</div>}
            </FormGroup>


            <Row>
                <Col sm={{ size: '4', offset: 8 }}>
                    <Button type={"submit"} disabled={!formIsValid} onClick={handleSubmit}>  Submit </Button>
                </Col>
            </Row>

            {
                error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }
        </div>
    );
}

export default LoginForm;
