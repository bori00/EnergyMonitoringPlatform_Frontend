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
    const [recipientSawAll, setRecipientSawAll] = useState(false);
    const messagesRef = useRef();
    messagesRef.current = messages;

    useEffect(() => {
        API_CHAT.receiveMessages(on_message_received, props.onSessionEndCallback, API_AUTH.getCurrentUserName(), recipientName)
        API_CHAT.receiveMessageReadingStatusUpdates(on_message_reading_status_update_callback, API_AUTH.getCurrentUserName(), recipientName)
        API_CHAT.receiveTypingStatusUpdates(on_partner_typing_status_update_callback, API_AUTH.getCurrentUserName(), recipientName)
    }, [])

    const on_message_reading_status_update_callback = status_update => {
        console.log("Message Reading Update: ", status_update)
        setRecipientSawAll(true)
    }

    const on_partner_typing_status_update_callback = status_update => {
        console.log("Message Typing Update: ", status_update)
        setRecipientIsTyping(status_update.getTyping())
    }

    const on_message_received = message => {
        console.log("Message Received: ", message)

        let updatedMessages = messagesRef.current.map(m => m)
        updatedMessages.push(message)
        setMessages(updatedMessages)
    }

    const on_message_typing_status_send = (err, response) => {
        if (err != null || response.getSuccessful() === false) {
            console.log("We couldn't notify your partner " + recipientName + " that you are" +
                " typing.")
        }
    }

    const on_message_reading_status_send = (err, response) => {
        if (err != null || response.getSuccessful() === false) {
            console.log("We couldn't notify your partner " + recipientName + " that you read the" +
                " messages")
        }
    }

    function getTypingInfo() {
        return recipientName + " is typing";
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
                    setRecipientSawAll(false)
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

    function onStartTyping() {
        API_CHAT.sendMessageTypingStatusUpdate(on_message_typing_status_send, API_AUTH.getCurrentUserName(), recipientName, true)
    }

    function onEndTyping() {
        API_CHAT.sendMessageTypingStatusUpdate(on_message_typing_status_send, API_AUTH.getCurrentUserName(), recipientName, false)
    }

    function onSeeMessages() {
        API_CHAT.sendMessageReadingStatus(on_message_reading_status_send, API_AUTH.getCurrentUserName(), recipientName)
    }

    function getInfo() {
        if (recipientSawAll) return "Seen"
        else return "Unseen"
    }

    return <div style={{ position: "relative", height: "500px" }} onClick={() => onSeeMessages()}>
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Content userName={recipientName} info={getInfo()}/>
                </ConversationHeader>
                <MessageList typingIndicator={recipientIsTyping && <TypingIndicator content={getTypingInfo()}/>}>
                    {getMessagesList()}
                </MessageList>
                <MessageInput placeholder="Type message here" attachButton={false} onFocus={() =>onStartTyping()} onBlur={() => onEndTyping()} onSend={onMessageSend}/>
            </ChatContainer>
        </MainContainer>
    </div>
}

export default CustomChatContainer;