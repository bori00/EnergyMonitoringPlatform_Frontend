import React, {useEffect, Fragment, useState, useRef} from 'react';
import {
    ListGroup,
    ListGroupItem,
} from 'reactstrap';

import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils";

function ClientDeviceLogs() {

    const [logs, setLogs] = useState([]);
    const stateRef = useRef();
    stateRef.current = logs;

    const maxDisplayedLogs = 2;

    function onUpdateCallback(message, currLogsRef) {
        const consumptionUpdateDTO = JSON.parse(message.body);
        let currLogs = currLogsRef.current;
        setLogs([updateToReactLog(consumptionUpdateDTO, logs.length + 1), currLogs]);
    }

    function updateToReactLog(update, id) {
        return <ListGroupItem key={id}>{update.deviceName} consumption: {update.hourlyEnergyConsumption} (threshold: {update.hourlyEnergyConsumptionThreshold})</ListGroupItem>
    }

    useEffect(() => {
        API_NOTIFICATIONS.subscribeToClientDeviceConsumptionUpdateNotifications((message) => {onUpdateCallback(message, stateRef)});
    }, [])

    return (
        <Fragment>
            <h3>Consumption Updates</h3>
            <ListGroup style={{maxHeight: 300, overflowY: "scroll"}}>
                {logs}
            </ListGroup>
        </Fragment>
    );

}

export default ClientDeviceLogs;
