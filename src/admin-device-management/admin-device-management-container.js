import React, {useEffect} from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import AdminDeviceList from "./admin-device-list";
import {useHistory} from "react-router-dom";
import * as API_AUTH from "../commons/authentication/auth-api";

function AdminDeviceManagementContainer() {

    const history = useHistory();

    useEffect(() => {
        API_AUTH.guaranteeUserHasRole('ADMIN', history);
    })

    return (
        <div>
            <CardHeader>
                <strong>Device Management</strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <AdminDeviceList />
                    </Col>
                </Row>

            </Card>

        </div>
    );

}

export default AdminDeviceManagementContainer;
