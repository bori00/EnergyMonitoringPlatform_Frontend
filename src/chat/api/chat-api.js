import {HOST} from "../../commons/hosts";
import * as GRPC_HELPER from "../../commons/grpc"
import {ChatMessage, ChatMessageRequest} from "../../chat-proto-gen/chat_pb";
import {ChatServiceClient} from "../../chat-proto-gen/chat_grpc_web_pb";

function receiveMessageReadingStatusUpdates(data_callback) {

    // const client = new ChatServiceClient(HOST.grpc_api);
    // const call = client.receiveOpenSessionRequest(new Empty(), {deadline: GRPC_HELPER.getTimelessRequestTimeout()});
    // call.on('data', data_callback);
}

function sendMessage(callback, message, senderName, recipientName) {
    let chatMessage = new ChatMessage();
    chatMessage.setFromusername(senderName);
    chatMessage.setTousername(recipientName);
    chatMessage.setMessage(message);


    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .sendMessage(chatMessage, {deadline: GRPC_HELPER.getTimelessRequestTimeout()}, callback);
}

function receiveMessages(data_callback, end_callback, senderName, recipientName) {
    let chatmessageRequest = new ChatMessageRequest();
    chatmessageRequest.setRecipientname(recipientName);
    chatmessageRequest.setSendername(senderName);

    const call = new ChatServiceClient(HOST.grpc_api)
        .receiveMessage(chatmessageRequest, {deadline: GRPC_HELPER.getTimelessRequestTimeout()});
    call.on('data', data_callback);
    call.on('end', end_callback);
}

export {
    receiveMessageReadingStatusUpdates,
    sendMessage,
    receiveMessages
};