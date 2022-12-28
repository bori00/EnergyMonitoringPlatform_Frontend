import {HOST} from "../../commons/hosts";
import {OpenSessionRequest, OpenSessionRequestResponse} from "../../chat-proto-gen/chat_pb";
import {ChatServiceClient} from "../../chat-proto-gen/chat_grpc_web_pb";
import * as GRPC_HELPER from "../../commons/grpc";

function receiveOpenSessionRequests(callback) {

    // create our greeting object
    let openSessionRequest = new OpenSessionRequest();
    openSessionRequest.setFromusername("bori")


    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api);
    const call = client.receiveOpenSessionRequest(openSessionRequest, {deadline: GRPC_HELPER.getTimelessRequestTimeout()});
    call.on('data', callback);
        // .receiveOpenSessionRequest(openSessionRequest, {}, callback);
}

function acceptOpenSessionRequest(callback, openSessionRequest) {

    // create our greeting object
    let openSessionRequestResponse = new OpenSessionRequestResponse();
    openSessionRequestResponse.setFromusername(openSessionRequest.getFromusername())
    openSessionRequestResponse.setAccepted(true)


    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .acceptOpenSessionRequest(openSessionRequestResponse, {}, callback);
}

export {
    receiveOpenSessionRequests,
    acceptOpenSessionRequest
};