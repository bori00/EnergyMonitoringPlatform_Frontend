import React, {useEffect} from 'react';
import {Card, CardHeader, Col, Row } from 'reactstrap';

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"
import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";

function AdminChatContainer() {

    const history = useHistory();

    useEffect(() => {
        API_NOTIFICATIONS.setupRoleSpecificNotifications();
        API_AUTH.guaranteeUserHasRole('ADMIN', history);
    })

    return (
        <div>
            <CardHeader>
                <strong>Admin Chat</strong>
            </CardHeader>

            <Card>
                <br />

            </Card>

        </div>
    );

}

export default AdminChatContainer;
