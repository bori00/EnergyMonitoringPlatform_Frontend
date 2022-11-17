import {HOST} from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client"

import * as API_AUTH from "../../commons/authentication/auth-api"

const endpoint = {
    getAllDevices: '/device-management/get-all-devices',
    deleteDevcie: '/device-management/delete-device',
    getAllClients: '/user-crud/get-all-clients',
    updateDevice: '/device-management/update-device',
    createDevice: '/device-management/create-device'
};

function getAllDevices(callback) {

    const request = new Request(HOST.backend_api + endpoint.getAllDevices, {
        method: 'GET',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithJsonResponse(request, callback);
}

function deleteDevice(callback, device_id) {
    const request = new Request(HOST.backend_api + endpoint.deleteDevcie + "/" + device_id, {
        method: 'DELETE',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithNoResponse(request, callback);
}

function updateDevice(callback, device_id, name, userName, maxHourlyConsumption, description, address) {
    const body = {"id": device_id,
        name: name,
        userName: userName,
        maxEnergyConsumption: maxHourlyConsumption,
        description: description,
        address: address};

    const request = new Request(HOST.backend_api + endpoint.updateDevice, {
        method: 'PUT',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
        body: JSON.stringify(body)
    });

    RestApiClient.performRequestWithNoResponse(request, callback);
}

function createDevice(callback, name, userName, maxHourlyConsumption, description, address) {
    const body = {"name": name,
        "userName": userName,
        "maxEnergyConsumption": maxHourlyConsumption,
        "description": description,
        "address": address};

    console.log(body)

    const request = new Request(HOST.backend_api + endpoint.createDevice, {
        method: 'POST',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
        body: JSON.stringify(body)
    });

    RestApiClient.performRequestWithNoResponse(request, callback);
}

function getAllClients(callback) {
    const request = new Request(HOST.backend_api + endpoint.getAllClients, {
        method: 'GET',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithJsonResponse(request, callback);
}

export {
    getAllDevices,
    deleteDevice,
    getAllClients,
    updateDevice,
    createDevice
};