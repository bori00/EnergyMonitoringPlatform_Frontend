import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavigationBar from './navigation-bar';
import Home from './home/home';
import LoginContainer from "./authentication/login-container";
import RegistrationContainer from "./registration/registration-container";
import ErrorPage from './commons/errorhandling/error-page';
import LogoutFunction from "./authentication/logout-container";
import styles from './commons/styles/project-style.css';
import AdminDeviceManagementContainer
    from "./admin-device-management/admin-device-management-container";
import AdminUserManagementContainer
    from "./admin-user-management/admin-user-management-container";
import ClientDeviceMonitoringContainer
    from "./client-device-monitoring/client-device-monitoring-container";
import ClientConsumptionMonitoringContainer
    from "./client-consumption-monitoring/client-consumption-monitoring-container";
import ClientChatContainer from "./client-chat/client-chat-container";
import AdminChatContainer from "./admin-chat/admin-chat-container";

function App() {
    return (
        <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home />}
                        />

                        <Route
                            exact
                            path='/login'
                            render={() => <LoginContainer />}
                        />

                        <Route
                            exact
                            path='/logout'
                            render={() => <LogoutFunction />}
                        />

                        <Route
                            exact
                            path='/register'
                            render={() => <RegistrationContainer />}
                        />

                        <Route
                            exact
                            path='/admin-device-management'
                            render={() => <AdminDeviceManagementContainer />}
                        />

                        <Route
                            exact
                            path='/admin-user-management'
                            render={() => <AdminUserManagementContainer />}
                        />

                        <Route
                            exact
                            path='/client-devices-monitoring'
                            render={() => <ClientDeviceMonitoringContainer />}
                        />

                        <Route
                            exact
                            path='/client-consumption-monitoring'
                            render={() => <ClientConsumptionMonitoringContainer />}
                        />

                        <Route
                            exact
                            path='/client-chat'
                            render={() => <ClientChatContainer />}
                        />

                        <Route
                            exact
                            path='/admin-chat'
                            render={() => <AdminChatContainer />}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage />}
                        />

                        <Route render={() => <ErrorPage />} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
