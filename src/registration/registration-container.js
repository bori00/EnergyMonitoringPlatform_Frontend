import React  from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import RegistrationForm from "./registration-form";

function RegistrationContainer() {
    return (
        <div>
            <CardHeader>
                <strong> User Registration </strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <RegistrationForm />
                    </Col>
                </Row>

            </Card>

        </div>
    );

}

export default RegistrationContainer;
