import React, {useEffect, Fragment, useState} from 'react';
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemText,
    ListGroupItemHeading,
    Button
} from 'reactstrap';

import * as API_DEVICES from "./api/client-device-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import DeviceChartModal from "./device-chart-modal";
import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils";

function ClientDeviceLogs() {

    const [logs, setLogs] = useState([]);
    const [updates, setUpdates] = useState([]);

    function onUpdateCallback(message) {
        const consumptionUpdateDTO = JSON.parse(message.body);
        console.log("Consumption Update: The hourly energy consumption of device " + consumptionUpdateDTO.deviceName +
            " increased to the value " + consumptionUpdateDTO.hourlyEnergyConsumption + ", with the " +
            "threshold being " + consumptionUpdateDTO.hourlyEnergyConsumptionThreshold);
        const newUpdates = [...updates];
        console.log("Length: ", newUpdates.length)
        newUpdates.push(consumptionUpdateDTO);
        setUpdates(newUpdates)
        console.log(newUpdates, updates)
    }

    function updateToReactLog(update) {
        return <ListGroupItem>Device {update.deviceName} consumption: {update.hourlyEnergyConsumption} (threshold: {update.hourlyEnergyConsumptionThreshold}</ListGroupItem>
    }

    useEffect(() => {
        API_NOTIFICATIONS.subscribeToClientDeviceConsumptionUpdateNotifications(onUpdateCallback);
    }, [])

    return (
        <Fragment>
            <h3>Consumption Updates</h3>
            <ListGroup>
                {updates.forEach(update => updateToReactLog(update))}
            </ListGroup>
        </Fragment>
    );

}

export default ClientDeviceLogs;
