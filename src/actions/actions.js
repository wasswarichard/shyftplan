import * as actions from "../actionTypes/actionTypes";
export const UserJoined = description => ({
    type: actions.LOGIN_USER,
    payload: {
       description
    }
});