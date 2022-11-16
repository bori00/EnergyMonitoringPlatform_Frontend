import React, {useEffect} from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import AdminUserList from "./admin-user-list";
import {useHistory} from "react-router-dom";
import * as API_AUTH from "../commons/authentication/auth-api";

function AdminUserManagementContainer() {

    const history = useHistory();

    useEffect(() => {
        API_AUTH.guaranteeUserHasRole('ADMIN', history);
    })

    return (
        <div>
            <CardHeader>
                <strong>User Management</strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <AdminUserList />
                    </Col>
                </Row>

            </Card>

        </div>
    );

}

export default AdminUserManagementContainer;
