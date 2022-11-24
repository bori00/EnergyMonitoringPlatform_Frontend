import React, {useEffect} from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import ClientDeviceLogs from "./client-device-logs";
import {useHistory} from "react-router-dom";
import * as API_AUTH from "../commons/authentication/auth-api";
import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"

function ClientConsumptionMonitoringContainer() {

    const history = useHistory();

    useEffect(() => {
        API_AUTH.guaranteeUserHasRole('CLIENT', history);
        API_NOTIFICATIONS.setupRoleSpecificNotifications();
    }, [])

    return (
        <div>
            <CardHeader>
                <strong>Realtime Consumption Monitoring</strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <ClientDeviceLogs />
                    </Col>
                </Row>

            </Card>

        </div>
    );

}

export default ClientConsumptionMonitoringContainer;
