import React, { useState, useEffect } from 'react';

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import * as API_AUTH from "../commons/authentication/auth-api";

function LogoutFunction() {
    useEffect(() => {
        console.log("Log out...")
        API_AUTH.logout();
    })

    return null;
}

export default LogoutFunction;
