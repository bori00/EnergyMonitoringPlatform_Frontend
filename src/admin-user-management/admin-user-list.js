import React, {useEffect, Fragment, useState} from 'react';
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemText,
    ListGroupItemHeading,
    Button
} from 'reactstrap';

import * as API_USERS from "./api/admin-user-api";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import {useHistory} from "react-router-dom";
import ManageUserModal from "./manage-user-modal";

function AdminDeviceList() {

    const [error, setError] = useState({ status: 0, errorMessage: null });
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const history = useHistory();

    function userSelected(user) {
        setSelectedUser(user)
    }

    function onAddUserIntention() {
        history.push("/register");
        window.location.reload();
    }

    useEffect(() => {
        API_USERS.getAllUsers((result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                let users = [];
                result.forEach(user => {
                    users.push(
                        <ListGroupItem key={user.id} action onClick={() => userSelected(user)}>
                            <ListGroupItemHeading>{user.userName}</ListGroupItemHeading>
                            <ListGroupItemText>{user.emailAddress}</ListGroupItemText>
                        </ListGroupItem>
                    )
                })

                setUsers(users);
            } else {
                setError({ status: err.status, errorMessage: err });
            }
        })
    }, [selectedUser])

    return (
        <Fragment>

            <Button color="info" onClick={() => onAddUserIntention()}>New</Button>

            <ListGroup>
                {users}
            </ListGroup>

            {
                error.status > 0 &&
                <APIResponseErrorMessage errorStatus={error.status} error={error.errorMessage} />
            }

            {
                selectedUser !== null &&
                <ManageUserModal user={selectedUser} onClose={() => {setSelectedUser(null)}}/>
            }
        </Fragment>
    );

}

export default AdminDeviceList;
