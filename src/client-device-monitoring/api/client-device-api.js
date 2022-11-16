import {HOST} from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client"

import * as API_AUTH from "../../commons/authentication/auth-api"

const endpoint = {
    getMyDevices: '/device-monitoring/get-my-devices',
    getDeviceConsumptionForDay: '/device-monitoring/get-energy-consumption-for-day'
};

function getMyDevices(callback) {

    const request = new Request(HOST.backend_api + endpoint.getMyDevices, {
        method: 'GET',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithJsonResponse(request, callback);
}

function getDeviceConsumptionForDay(callback, device_id, date) {

    const request = new Request(HOST.backend_api + endpoint.getDeviceConsumptionForDay +
        '?deviceId=' + device_id +
        '&year=' + date.getFullYear() +
        '&month=' + (date.getMonth()+1) +
        '&day=' + date.getDate(), {
        method: 'GET',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithJsonResponse(request, callback);
}

export {
    getMyDevices,
    getDeviceConsumptionForDay
};