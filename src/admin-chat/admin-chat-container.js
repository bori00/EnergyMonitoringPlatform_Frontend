import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, CardHeader, Col, Row, ListGroup, ListGroupItem} from 'reactstrap';

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"
import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";
import * as API_ADMIN_CHAT from "./api/admin-chat-api";
import * as API_CHAT from "./../chat/api/chat-api"
import CustomChatContainer from "../chat/chat-container";

function AdminChatContainer() {

    const history = useHistory();
    const [incomingRequestsFromClients, setIncomingRequestsFromClients] = useState([]);
    const incomingRequestsFromClientsRef = useRef();
    incomingRequestsFromClientsRef.current = incomingRequestsFromClients;
    const [openSessionsData, setOpenSessionsData] = useState({});
    const openSessionsDataRef = useRef();
    openSessionsDataRef.current = openSessionsData;
    // const [openSessionChatContainers, setOpenSessionChatContainers] = useState([]);
    // const openSessionChatContainersRef = useRef();
    // openSessionChatContainersRef.current = openSessionChatContainers;
    // const [nextChatId, setNextChatId] = useState(0);

    useEffect(() => {
        API_NOTIFICATIONS.setupRoleSpecificNotifications();
        API_AUTH.guaranteeUserHasRole('ADMIN', history);
        API_ADMIN_CHAT.receiveOpenSessionRequests(onOpenChatSessionRequestCallback)
        API_CHAT.receiveChatUpdates(onChatUpdateCallback, API_AUTH.getCurrentUserName())
    }, [])

    const onChatUpdateCallback = (chatUpdate) => {
        if (chatUpdate.hasMessage()) {
            onMessageReceived(chatUpdate.getMessage())
        } else if (chatUpdate.hasReadingstatus()) {
            onMessageReadingStatusUpdateCallback(chatUpdate.getReadingstatus())
        } else if (chatUpdate.hasTypingstatus()) {
            onPartnerTypingStatusUpdateCallback(chatUpdate.getTypingstatus())
        } else if (chatUpdate.hasSessionclosedupdate()) {
            onSessionEnd(chatUpdate.getSessionclosedupdate().getPartnername())
        }
    }

    const onOpenChatSessionRequestCallback = (openSessionRequest) => {
        console.log({openSessionRequest});
        let updatedIncomingRequests = incomingRequestsFromClientsRef.current.map(r => r)
        updatedIncomingRequests.push(openSessionRequest)
        setIncomingRequestsFromClients(updatedIncomingRequests)
    }

    const onMessageReadingStatusUpdateCallback = status_update => {
        console.log("Message Reading Update: ", status_update)

        let updatedOpenSessionsData = {...openSessionsDataRef.current};
        updatedOpenSessionsData[status_update.getReaderusername()].recipientSawAll = true;
        setOpenSessionsData(updatedOpenSessionsData)

        console.log("Updated open sessions data:")
        console.log(openSessionsData)
    }

    const onPartnerTypingStatusUpdateCallback = status_update => {
        console.log("Message Typing Update: ", status_update)

        let updatedOpenSessionsData = {...openSessionsDataRef.current};
        updatedOpenSessionsData[status_update.getTyperusername()].recipientIsTyping = status_update.getTyping();
        setOpenSessionsData(updatedOpenSessionsData)

        console.log("Updated open sessions data:")
        console.log(openSessionsData)
    }

    const onMessageReceived = message => {
        console.log("Message Received: ", message)

        let updatedOpenSessionsData = {...openSessionsDataRef.current};
        updatedOpenSessionsData[message.getFromusername()].messages.push(message)
        setOpenSessionsData(updatedOpenSessionsData)

        console.log("Updated open sessions data:")
        console.log(openSessionsData)
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
                    let updatedOpenSessions = {...openSessionsDataRef.current}
                    updatedOpenSessions[openSessionRequest.getFromusername()] = {
                        messages: [],
                        recipientIsTyping: false,
                        recipientSawAll: true
                    }
                    setOpenSessionsData(updatedOpenSessions)
                    console.log("Updated open sessions data after accepting request")
                    console.log(openSessionsData)

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
        return incomingRequestsFromClients.map(fromUserName => openSessionRequestToListGroupItem(fromUserName, nr++))
    }

    function onSessionEnd(clientName) {
        console.log("Session End with client: " + clientName)
        window.alert("The client " + clientName + " has left the session. Thus, the session is" +
            " closed.")

        let updatedOpenSessions = {...openSessionsDataRef.current}
        delete updatedOpenSessions[clientName];
        setOpenSessionsData(updatedOpenSessions)
        console.log("Updated open sessions data after accepting request")
        console.log(openSessionsData)
    }

    const onMessageSentCallback = sentMessage => {
        let updatedOpenSessionsData = {...openSessionsDataRef.current};
        updatedOpenSessionsData[sentMessage.getTousername()].messages.push(sentMessage)
        updatedOpenSessionsData[sentMessage.getTousername()].recipientSawAll = false;
        setOpenSessionsData(updatedOpenSessionsData)

        console.log("Updated open sessions data:")
        console.log(openSessionsData)
    }

    function recipientNameToOpenSessionChatContainer(name, key) {
        return <CustomChatContainer
            key={key}
            recipientName={name}
            messages={openSessionsData[name].messages}
            recipientIsTyping={openSessionsData[name].recipientIsTyping}
            recipientSawAll={openSessionsData[name].recipientSawAll}
            onMessageSentCallback={onMessageSentCallback}
        />
    }

    function getOpenSessionChatContainers() {
        let containers = [];
        let key = 0;
        for (const recipientName in openSessionsData) {
            console.log("Added Chat container for " + recipientName)
            containers.push(recipientNameToOpenSessionChatContainer(recipientName, key++))
        }
        console.log("Containers: ")
        console.log(containers)
        return containers;
    }

    return (
        <div>
            <CardHeader>
                <strong>Client Assistance</strong>
            </CardHeader>

            {
                API_AUTH.getCurrentUserName() === "admin" &&
                <Card>
                    <br/>
                    <Row>
                        <Col sm={{size: '8', offset: 1}}>
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
            }

        </div>
    );

}

export default AdminChatContainer;
