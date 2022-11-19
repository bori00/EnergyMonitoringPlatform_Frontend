import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import * as HOST from "../hosts";

import * as AUTH_API from "../authentication/auth-api";

function subscribeToClientNotifications() {
    var socket = new SockJS(HOST.HOST.backend_api + '/secured/energy-utility');
    var stompClient = Stomp.over(socket);

    console.log("Socket setup")

    stompClient.connect({},
        /* onConnected */ function (frame) {
            stompClient.subscribe("/user/" +
                AUTH_API.getCurrentUserName() +
                "/queue/device-energy-consumption-threshold-passed",
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
    const anomalyDTO = JSON.parse(message.body);
    window.alert("Anomaly detected: The hourly energy consumption of device " + anomalyDTO.deviceName + " passed the preset threshold. Please verify that the device is working as intended!\n" +
    "Hourly energy consumption: " + anomalyDTO.hourlyEnergyConsumption + "\n" +
    "Threshold: " + anomalyDTO.hourlyEnergyConsumptionLimit);
}

function setupRoleSpecificNotifications() {
    if (AUTH_API.getCurrentUserRole() === "CLIENT") {
        subscribeToClientNotifications();
    }
}

export {
    setupRoleSpecificNotifications
};