import React, {useEffect} from 'react';
import { Button, Container, Jumbotron } from 'reactstrap';

import BackgroundImg from '../commons/images/background.png';
import * as API_NOTIFICATIONS from "../commons/sockets/socket-utils";

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "1920px",
    backgroundImage: `url(${BackgroundImg})`
};
const textStyle = { color: 'white', };

function Home() {

    useEffect(() => {
        API_NOTIFICATIONS.setupRoleSpecificNotifications();
    });

    return (
        <div>
            <Jumbotron fluid style={backgroundStyle}>
                <Container fluid>
                    <h1 className="display-3" style={textStyle}>Energy Utility Platform</h1>
                    <p className="lead" style={textStyle}> <b>Enabling real time monitoring of smart devices.</b> </p>
                    <hr className="my-2" />
                    <p style={textStyle}> <b>This assignment represents the first module of the distributed software system "Integrated
                        Energy Monitoring Platform for Households" that represents the final project
                        for the Distributed Systems course. </b> </p>
                </Container>
            </Jumbotron>
        </div>
    );
}


export default Home;