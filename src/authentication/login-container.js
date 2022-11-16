import React  from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import LoginForm from "./login-form";

function LoginContainer() {
    return (
        <div>
            <CardHeader>
                <strong> Login </strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <LoginForm />
                    </Col>
                </Row>

            </Card>

        </div>
    );

}

export default LoginContainer;
