import React, {useState,  Fragment, useLayoutEffect} from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavLink, UncontrolledDropdown,  } from 'reactstrap';

import logo from './commons/images/logo.png';
import * as API_AUTH from "./commons/authentication/auth-api";

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};

function NavigationBar() {
    const [userRole, setUserRole] = useState(null);

    useLayoutEffect(() => {
        setUserRole(API_AUTH.getCurrentUserRole());
    });

    return (
        <div>
            <Navbar color="dark" light expand="md">
                <NavbarBrand href="/">
                    <img src={logo} width={"60"}
                        height={"55"} />
                </NavbarBrand>

                <Nav className="mr-auto" navbar>

                    {
                        userRole === 'ADMIN' &&
                        (
                            <Fragment>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle style={textStyle} nav caret>
                                    Admin Menu
                                    </DropdownToggle>
                                    <DropdownMenu right>

                                    <DropdownItem>
                                        <NavLink href="/admin-device-management">Devices</NavLink>
                                    </DropdownItem>

                                    <DropdownItem>
                                        <NavLink href="/admin-user-management">Users</NavLink>
                                    </DropdownItem>


                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle style={textStyle} nav caret>
                                    Account
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                    <DropdownItem>
                                    <NavLink href="/logout">Logout</NavLink>
                                    </DropdownItem>
                                    </DropdownMenu>

                                </UncontrolledDropdown>
                            </Fragment>
                        )
                    }

                    {
                        userRole === 'CLIENT' &&
                        <Fragment>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle style={textStyle} nav caret>
                                    Client Menu
                                </DropdownToggle>
                                <DropdownMenu right>

                                    <DropdownItem>
                                        <NavLink href="/client-devices-monitoring">My Devices</NavLink>
                                    </DropdownItem>

                                    <DropdownItem>
                                        <NavLink href="/client-consumption-monitoring">Consumption Updates</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>


                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle style={textStyle} nav caret>
                                    Account
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="/logout">Logout</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>

                            </UncontrolledDropdown>
                        </Fragment>
                    }

                    {
                        userRole === null &&
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle style={textStyle} nav caret>
                                Account
                            </DropdownToggle>
                            <DropdownMenu right>

                                <DropdownItem>
                                    <NavLink href="/login">Login</NavLink>
                                </DropdownItem>

                                <DropdownItem>
                                    <NavLink href="/register">Register</NavLink>
                                </DropdownItem>


                            </DropdownMenu>

                        </UncontrolledDropdown>
                    }

                </Nav>
            </Navbar>
        </div>
    );
}

export default NavigationBar;
