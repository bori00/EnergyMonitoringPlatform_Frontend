import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { Dots } from 'loading-animations-react';

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"
import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";
import * as API_CLIENT_CHAT from "./api/client-chat-api"
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import CustomChatContainer from "../chat/chat-container";

function ClientChatContainer() {

    const history = useHistory();
    const [sentOpenSessionRequest, setSentOpenSessionRequest] = useState(false);
    const [sessionIsOpen, setSessionIsOpen] = useState(false);
    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [messages, setMessages] = useState([]);
    const [recipientIsTyping, setRecipientIsTyping] = useState(false)

    useEffect(() => {
        // API_NOTIFICATIONS.setupRoleSpecificNotifications();
        API_AUTH.guaranteeUserHasRole('CLIENT', history);
    }, [])

    function onSendOpenSessionRequest() {
        const callback = (err, response) => {
            console.log({err, response});
            if (err != null) {
                window.alert("An error occurred while trying to connect you with an admin." +
                    " Please try again later!")
            } else {
                if (response.getAccepted()) {
                    setSessionIsOpen(true);
                } else {
                    window.alert("Your request for assistance was rejected by the admin. We're" +
                        " sorry! Please try again later!")
                }
            }
        };

        API_CLIENT_CHAT.sendOpenSessionRequest(callback, API_AUTH.getCurrentUserName())

        setSentOpenSessionRequest(true);
    }

    function onSessionEnd() {
        console.log("Session End with admin")
        window.alert("The admin has left the session. Thus, the session is closed.")
        setSentOpenSessionRequest(false);
        setSessionIsOpen(false);
    }

    return (
        <div>
            <CardHeader>
                <strong>Client Chat</strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        {   sentOpenSessionRequest === false &&
                            <Button onClick={() => {onSendOpenSessionRequest()}}>Contact an Admin</Button>
                        }

                        {
                            sentOpenSessionRequest === true && sessionIsOpen === false &&
                            <Dots text="Waiting for an admin to respond..."/>
                        }

                        {
                            sessionIsOpen === true &&
                            <Fragment>
                                <h1>Chat Session</h1>

                                <CustomChatContainer recipientName="admin" onSessionEndCallback={() => onSessionEnd()}/>
                            </Fragment>
                        }

                        {
                            error.status > 0 &&
                            <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
                        }
                    </Col>
                </Row>
            </Card>

        </div>
    );

}

export default ClientChatContainer;
