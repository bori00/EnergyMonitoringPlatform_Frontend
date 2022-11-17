import React, {useEffect, Fragment, useState} from 'react';
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemText,
    ListGroupItemHeading,
    Button
} from 'reactstrap';

import * as API_DEVICES from "./api/admin-device-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import ManageDeviceModal from "./manage-device-modal";
import CreateDeviceModal from "./add-device-modal";
import de from "react-datepicker";

function AdminDeviceList() {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [addDeviceIntention, setAddDeviceIntention] = useState(0);

    function deviceSelected(device) {
        console.log("Selected device: ", device)
        setSelectedDevice(device)
    }

    function onAddDeviceIntention() {
        setAddDeviceIntention(1);
    }

    useEffect(() => {
        API_DEVICES.getAllDevices((result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                let devices = [];
                result.forEach(device => {
                    devices.push(
                        <ListGroupItem key={device.id} action onClick={() => deviceSelected(device)}>
                            <ListGroupItemHeading>{device.name}</ListGroupItemHeading>
                            <ListGroupItemText><i>Owner: {device.userName}</i></ListGroupItemText>
                            {device.address !== null && device.address !== "" &&
                                <ListGroupItemText><i>Address: {device.address}</i></ListGroupItemText>
                            }
                            {device.description !== null && device.description !== "" &&
                                <ListGroupItemText>{device.description}</ListGroupItemText>
                            }
                        </ListGroupItem>
                    )
                });

                setDevices(devices);
            } else {
                setError((error) => ({ status: status, errorMessage: err }));
            }
        })
    }, [selectedDevice, addDeviceIntention])

    return (
        <Fragment>
            <Button color="info" onClick={() => onAddDeviceIntention()}>New</Button>
            
            <ListGroup>
                {devices}
            </ListGroup>

            {
                error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }

            {
                selectedDevice !== null &&
                <ManageDeviceModal device={selectedDevice} onClose={() => {setSelectedDevice(null)}}/>
            }

            {
                addDeviceIntention === 1 &&
                <CreateDeviceModal onClose={() => {setAddDeviceIntention(0)}}/>
            }
        </Fragment>
    );

}

export default AdminDeviceList;
