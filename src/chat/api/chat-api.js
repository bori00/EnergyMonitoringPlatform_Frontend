import {HOST} from "../../commons/hosts";
import * as GRPC_HELPER from "../../commons/grpc"
import {ChatMessage, ChatUpdateRequest, MessageTypingStatus, MessageReadingStatus} from "../../chat-proto-gen/chat_pb";
import {ChatServiceClient} from "../../chat-proto-gen/chat_grpc_web_pb";

function sendMessageReadingStatus(callback, readerUserName, recipientName) {
    let messageReadingStatus = new MessageReadingStatus();
    messageReadingStatus.setReaderusername(readerUserName);
    messageReadingStatus.setSenderusername(recipientName);

    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .sendMessageReadingStatusUpdate(messageReadingStatus, {}, callback);
}

function sendMessageTypingStatusUpdate(callback, typerUsername, recipientName, isTyping) {
    let messageTypingStatus = new MessageTypingStatus();
    messageTypingStatus.setTyperusername(typerUsername);
    messageTypingStatus.setRecipientusername(recipientName);
    messageTypingStatus.setTyping(isTyping)

    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .sendMessageTypingStatusUpdate(messageTypingStatus, {}, callback);
}

function sendMessage(callback, message, senderName, recipientName) {
    let chatMessage = new ChatMessage();
    chatMessage.setFromusername(senderName);
    chatMessage.setTousername(recipientName);
    chatMessage.setMessage(message);

    console.log("Sending message: " + chatMessage)
    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .sendMessage(chatMessage, {}, callback);
}

function receiveChatUpdates(data_callback, requestSenderName, end_callback = () => {}) {
    let updateRequest = new ChatUpdateRequest();
    updateRequest.setRequestsendername(requestSenderName)

    const call = new ChatServiceClient(HOST.grpc_api)
        .receiveChatUpdates(updateRequest, {deadline: GRPC_HELPER.getTimelessRequestTimeout()});
    call.on('data', data_callback);
    call.on('end', end_callback)
}

export {
    sendMessage,
    receiveChatUpdates,
    sendMessageReadingStatus,
    sendMessageTypingStatusUpdate
};