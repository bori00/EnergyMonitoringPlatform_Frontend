import {HOST} from "../hosts";
import RestApiClient from "../api/rest-client";
import * as API_SOCKET from "../sockets/socket-utils";

const endpoint = {
    login: '/auth/login'
};

const util = require('util')

const USER_KEY = 'user';

 function login(callback, username, password) {

    const body = {"userName": username, "password": password}

    const request = new Request(HOST.backend_api + endpoint.login, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    console.log(request.url);
    RestApiClient.performRequestWithJsonResponse(request, callback);
}

const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    }
};


function setActiveUser(user, callback) {
    asyncLocalStorage.setItem(USER_KEY, JSON.stringify(user)).then(() => callback());
}

function logout() {
    localStorage.removeItem(USER_KEY);
}

function getCurrentUser() {
    return  JSON.parse(localStorage.getItem(USER_KEY))
}

function getCurrentUserRole() {
     if (localStorage.getItem(USER_KEY) !== null) {
         return  JSON.parse(localStorage.getItem('user')).role;
     }
     return null;
}

function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}

function guaranteeUserHasRole(role, history) {
    if (getCurrentUserRole() !== role) {
        history.push("/login");
        window.location.reload();
        window.alert("Please sign in with a " + role + " account to access this" +
            " functionality.");
    }
}

export {
    login,
    setActiveUser,
    logout,
    getCurrentUser,
    getCurrentUserRole,
    authHeader,
    guaranteeUserHasRole
};