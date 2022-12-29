import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Card, CardHeader, Col, Row, Button, ListGroupItem} from 'reactstrap';
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

import * as API_AUTH from "../commons/authentication/auth-api";
import {useHistory} from "react-router-dom";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_CHAT from "./api/chat-api"

function CustomChatContainer(props) {
    const [messages, setMessages] = useState([]);
    const [recipientIsTyping, setRecipientIsTyping] = useState(false)
    const [recipientName, setRecipientName] = useState(props.recipientName);
    const messagesRef = useRef();
    messagesRef.current = messages;

    useEffect(() => {
        API_CHAT.receiveMessages(on_message_received, props.onSessionEndCallback, recipientName, API_AUTH.getCurrentUserName())
        API_CHAT.receiveMessageReadingStatusUpdates(on_message_reading_status_update_callback)
    }, [])

    const on_message_reading_status_update_callback = status_update => {
        console.log("Message Reading Update: ", status_update)
    }

    const on_message_received = message => {
        console.log("Message Received: ", message)

        let updatedMessages = messagesRef.current.map(m => m)
        updatedMessages.push(message)
        setMessages(updatedMessages)
    }

    function getTypingInfo() {
        return recipientName + " is typing";
    }

    function onReadMessages() {

    }

    function onMessageSend(innerHtml, textContent, innerText, nodes) {
        const callback = (err, response) => {
            console.log({err, response});
            if (err != null) {
                window.alert("An error occurred while trying to send the message. Please try" +
                    " again later!")
            } else {
                if (response.hasSentmessage()) {
                    let updatedMessages = messagesRef.current.map(m => m)
                    updatedMessages.push(response.getSentmessage())
                    setMessages(updatedMessages)
                } else {
                    window.alert("Your message couldn't be delivered: " + response.getStatus().getErrormessage())
                }
            }
        };

        API_CHAT.sendMessage(callback, innerText, API_AUTH.getCurrentUserName(), recipientName)
    }

    function getMessageDirection(messageProto) {
        if (messageProto.getFromusername() === recipientName) {
            return "incoming";
        } else {
            return "outgoing";
        }
    }

    function messageToMessageComponent(messageProto, it) {
        return <Message key={it} model={{
            message: messageProto.getMessage(),
            sentTime: messageProto.getTimestamp(),
            sender: messageProto.getFromusername(),
            direction: getMessageDirection(messageProto),
            position: "single"
        }} />
    }

    function getMessagesList() {
        let nr = 0;
        return messages.map(messageProto => messageToMessageComponent(messageProto, nr++))
    }

    return <div style={{ position: "relative", height: "500px" }} onClick={() => console.log("Chat Focus In")}>
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Content userName={recipientName} />
                </ConversationHeader>
                <MessageList typingIndicator={<TypingIndicator content={getTypingInfo()}/>}>
                    {getMessagesList()}
                </MessageList>
                <MessageInput placeholder="Type message here" attachButton={false} onFocus={() => console.log("Focus In")} onBlur={() => console.log("focus out")} onSend={onMessageSend}/>
            </ChatContainer>
        </MainContainer>
    </div>
}

export default CustomChatContainer;