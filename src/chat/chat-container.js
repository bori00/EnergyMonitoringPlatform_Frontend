import React, {Fragment, useEffect, useState} from 'react';
import {Card, CardHeader, Col, Row, Button } from 'reactstrap';
import { Dots } from 'loading-animations-react';

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
    ConversationHeader
} from "@chatscope/chat-ui-kit-react";

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils"
import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";

function CustomChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [recipientIsTyping, setRecipientIsTyping] = useState(false)
    const [recipientName, setRecipientName] = useState(props.recipientName);

    useEffect(() => {

    }, [])

    function getTypingInfo() {
        return recipientName + " is typing";
    }

    return <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Content userName={recipientName} />
                </ConversationHeader>
                <MessageList typingIndicator={<TypingIndicator content={getTypingInfo()}/>}>
                    <Message
                        model={{
                            message: "Hello my friend",
                            sentTime: "just now",
                            sender: recipientName,
                            direction: "incoming",
                        }}
                    />
                    <Message
                        model={{
                            message: "Hello!",
                            sentTime: "just now",
                            sender: recipientName,
                            direction: "outgoing",
                        }}
                    />
                </MessageList>
                <MessageInput placeholder="Type message here" attachButton={false} />
            </ChatContainer>
        </MainContainer>
    </div>
}

export default CustomChatContainer;