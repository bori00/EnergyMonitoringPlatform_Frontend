import React, {useEffect, Fragment, useState, Form} from 'react';
import {
    Alert,
    Button,
    Col,
    Modal, ModalBody, ModalFooter, ModalHeader, Row,
    FormGroup, Label, Input, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';
import DatePicker from "react-datepicker";

import * as API_DEVICES from "./api/client-device-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import { Chart } from "react-google-charts";
import "react-datepicker/dist/react-datepicker.css";
import * as API_AUTH from "../commons/authentication/auth-api";

const options = {
    title: "Energy Consumption at every Hour",
    hAxis: { title: "Time [hour]", viewWindow: { min: 0, max: 23 } },
    vAxis: { title: "Energy Consumption [kWh]"},
    legend: 'none'
};

// const data = [
//     ["Hour", "Consumption"],
//     [1, 2]
// ];

function DeviceChartModal(props) {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [device, setDevice] = useState(props.device);
    const [date, setDate] = useState(new Date());
    const [consumptionData, setConsumptionData] = useState([["Hour", "Consumption"], [1, 0]]);
    const [measurementExists, setMeasurementExists] = useState(0);

    useEffect(() => {

        console.log(date);

        const callback = (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                let newConsumptionData = [["Hour", "Consumption"]];
                let hour = 0;
                let newMeasurementExists = 0;

                result.energyConsumptionPerHour.forEach(consumption => {
                    newConsumptionData.push([hour, consumption]);
                    if (consumption !== null) {
                        newMeasurementExists = 1;
                    }
                    hour++;
                })

                console.log("COnsumption", newConsumptionData);
                setConsumptionData(newConsumptionData);
                setMeasurementExists(newMeasurementExists);
            } else {
                setError({ status: err.status, errorMessage: err });
            }
        };

        API_DEVICES.getDeviceConsumptionForDay(callback, device.id, date);

    }, [date])

    function closeModal() {
        props.onClose();
    }

    return (
        <Modal isOpen>
            <ModalHeader>Energ Utilization for <b>{device.name}</b></ModalHeader>

            <ModalBody>
                { error.status === 0 &&

                    <Fragment>
                        <Label for='dateField'>Date: </Label>
                        <DatePicker selected={date}
                                    id="dateField"
                                    onChange={(date) => setDate(date)}
                        />

                        { measurementExists === 1 &&
                        <Chart
                            chartType="ColumnChart"
                            data={consumptionData}
                            options={options}
                            width="100%"
                            height="400px"
                            legendToggle
                        />}

                        { measurementExists === 0 &&
                            <p>No measurements are available for the selected day.</p>
                        }
                    </Fragment>
                }

                {
                    error.status > 0 &&
                    <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
                }
            </ModalBody>

            <ModalFooter>
                <Button color="white" onClick={closeModal}>Exit</Button>
            </ModalFooter>
        </Modal>

    );

}

export default DeviceChartModal;
