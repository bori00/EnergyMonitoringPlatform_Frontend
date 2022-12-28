import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardHeader, Col, Row, ListGroup, ListGroupItem} from 'reactstrap';

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"
import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";
import * as API_ADMIN_CHAT from "./api/admin-chat-api";
import CustomChatContainer from "../chat/chat-container";

function AdminChatContainer() {

    const history = useHistory();
    const [incomingRequestsFromClients, setIncomingRequestsFromClients] = useState([]);
    const incomingRequestsFromClientsRef = useRef();
    incomingRequestsFromClientsRef.current = incomingRequestsFromClients;
    const [openSessionClientNames, setOpenSessionClientNames] = useState([]);
    const openSessionClientNamesRef = useRef();
    openSessionClientNamesRef.current = openSessionClientNames;

    useEffect(() => {
        API_NOTIFICATIONS.setupRoleSpecificNotifications();
        API_AUTH.guaranteeUserHasRole('ADMIN', history);
        onReceiveOpenChatSessionRequests()
    }, [])

    function onReceiveOpenChatSessionRequests() {
        const callback = (openSessionReqeust) => {
            console.log({openSessionReqeust});
            let updatedIncomingRequests = incomingRequestsFromClientsRef.current.map(r => r)
            console.log("Array: ", updatedIncomingRequests)
            updatedIncomingRequests.push(openSessionReqeust)
            setIncomingRequestsFromClients(updatedIncomingRequests)
        };

        API_ADMIN_CHAT.receiveOpenSessionRequests(callback)
    }

    function onAcceptOpenChatSessionRequest(openSessionRequest) {
        const callback = (err, response) => {
            console.log("Accept Open Session Request -> Status = ", err, response)
            if (err === null) {
                console.log("Removing request")
                let updatedIncomingRequests = incomingRequestsFromClientsRef.current.map(r => r)
                updatedIncomingRequests.splice (incomingRequestsFromClients.indexOf(openSessionRequest), 1) // remove request
                setIncomingRequestsFromClients(updatedIncomingRequests)

                if (response.getSuccessful()) {
                    let updatedOpenSessions = openSessionClientNamesRef.current.map(c => c)
                    updatedOpenSessions.push(openSessionRequest.getFromusername())
                    setOpenSessionClientNames(updatedOpenSessions)
                } else {
                    window.alert("The session with client " + openSessionRequest.getFromusername() + " couldn't be established: " + response.getErrormessage())
                }
            } else {
                window.alert("The session with client " + openSessionRequest.getFromusername() + " couldn't be established")
            }
        };

        API_ADMIN_CHAT.acceptOpenSessionRequest(callback, openSessionRequest)
    }

    function openSessionRequestToListGroupItem(openSessionRequest, it) {
        return <ListGroupItem key={it}>
            Request from client <b>{openSessionRequest.getFromusername()}</b>
            <Button style={{float: "right"}} onClick={() => {onAcceptOpenChatSessionRequest(openSessionRequest)}}>Accept</Button>
        </ListGroupItem>
    }

    function getOpenSessionRequestsList() {
        let nr = 0;
        console.log(incomingRequestsFromClients)
        return incomingRequestsFromClients.map(fromUserName => openSessionRequestToListGroupItem(fromUserName, nr++))
    }

    function getOpenSessionChatContainers() {
        let key = 0;
        return openSessionClientNames.map(clientName => <CustomChatContainer key={key++} recipientName={clientName}/>)
    }

    return (
        <div>
            <CardHeader>
                <strong>Client Assistance</strong>
            </CardHeader>

            <Card>
                <br />
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <h3>Assistance Requests from Clients</h3>
                        <ListGroup variant="flush">
                            {getOpenSessionRequestsList()}
                        </ListGroup>
                    </Col>
                </Row>

                <hr/>

                <Row>
                    <Col sm={{size: '8', offset: 1}}>
                        <h3>Open Assistance Sessions</h3>

                        <div style={{
                            display: "grid",
                            gap: 30,
                            maxWidth: 800,
                            gridTemplateColumns: '49% 49%',
                            margin: '20 auto'
                        }}>
                            {getOpenSessionChatContainers()}
                        </div>
                    </Col>
                </Row>
            </Card>

        </div>
    );

}

export default AdminChatContainer;
