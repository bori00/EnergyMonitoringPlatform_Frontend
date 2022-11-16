import {HOST} from "../../commons/hosts";
import RestApiClient from "../../commons/api/rest-client"

import * as API_AUTH from "../../commons/authentication/auth-api"

const endpoint = {
    getAllUsers: '/user-crud/get-all-users',
    updateUser: '/user-crud/update-user',
    deleteUser: '/user-crud/delete-user'
};

function getAllUsers(callback) {
    const request = new Request(HOST.backend_api + endpoint.getAllUsers, {
        method: 'GET',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithJsonResponse(request, callback);
}

function updateUser(callback, userId, userName, password, emailAddress) {
    const body = {"id": userId,
        "userName": userName,
        "password": password,
        "emailAddress": emailAddress};

    console.log(body)

    const request = new Request(HOST.backend_api + endpoint.updateUser, {
        method: 'PUT',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
        body: JSON.stringify(body)
    });

    RestApiClient.performRequestWithNoResponse(request, callback);
}

function deleteUser(callback, user_id) {
    const request = new Request(HOST.backend_api + endpoint.deleteUser + "/" + user_id, {
        method: 'DELETE',
        headers: Object.assign({}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }, API_AUTH.authHeader()),
    });

    RestApiClient.performRequestWithNoResponse(request, callback);
}

export {
    getAllUsers,
    updateUser,
    deleteUser
};