import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import * as HOST from "../hosts";

import * as AUTH_API from "../authentication/auth-api";

function subscribeToClientNotifications() {
    var socket = new SockJS(HOST.HOST.backend_api + '/secured/energy-utility');
    // var socket = new WebSocket("ws://localhost:8080/secured/energy-utility");
    var stompClient = Stomp.over(socket);
    var sessionId = "";

    console.log("Socket setup")

    stompClient.connect({},
        /* onConnected */ function (frame) {
            stompClient.subscribe("/user/" + AUTH_API.getCurrentUserName() + "/queue/device",
                onDeviceEnergyConsumptionThresholdPassed);
            window.alert("You were successfully subscribed to the notifications about your" +
                " devices' consumption")
        },
        /* onError */
        function (frame) {
            window.alert("Error: Your subscription to notifications about your devices'" +
                " consumption FAILED")
        }
    );
}

function onDeviceEnergyConsumptionThresholdPassed(message) {
    window.alert("Notification from server: " + message);
}

function setupRoleSpecificNotifications() {
    if (AUTH_API.getCurrentUserRole() === "CLIENT") {
        subscribeToClientNotifications();
    }
}

export {
    setupRoleSpecificNotifications
};