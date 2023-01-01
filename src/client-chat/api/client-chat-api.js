import {HOST} from "../../commons/hosts";
import * as GRPC_HELPER from "../../commons/grpc"
import {OpenSessionRequest} from "../../chat-proto-gen/chat_pb";
import {ChatServiceClient} from "../../chat-proto-gen/chat_grpc_web_pb";

function sendOpenSessionRequest(callback, myUserName) {

    let openSessionRequest = new OpenSessionRequest();
    openSessionRequest.setFromusername(myUserName)


    // create gRPC client that will call ou java server
    const client = new ChatServiceClient(HOST.grpc_api)
        .sendOpenSessionRequest(openSessionRequest, {}, callback);
}

export {
    sendOpenSessionRequest
};