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

function ClientDeviceList() {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    function deviceSelected(device) {
        setSelectedDevice(device)
    }

    useEffect(() => {
        API_DEVICES.getMyDevices((result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                let devices = [];
                result.forEach(device => {
                    devices.push(
                        <ListGroupItem key={device.id} action onClick={() => deviceSelected(device)}>
                            <ListGroupItemHeading>{device.name}</ListGroupItemHeading>
                        </ListGroupItem>
                    )
                })

                setDevices(devices);
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        })
    }, [selectedDevice])

    return (
        <Fragment>
            <ListGroup>
                {devices}
            </ListGroup>

            {
                error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }

            {
                selectedDevice !== null &&
                <DeviceChartModal device={selectedDevice} onClose={() => {setSelectedDevice(null)}}/>
            }

        </Fragment>
    );

}

export default ClientDeviceList;
