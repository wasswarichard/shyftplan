import * as actions from "../actionTypes/actionTypes";
export default function reducer(state = [], action) {
    switch (action.type) {
        case actions.MESSAGE_ADDED:
            const message = action.payload.description
            return {...state, ...message}
        case actions.MESSAGE_REMOVED:
            return state.filter(message => message.id !== action.payload.id );
        case actions.LOGIN_USER:
            const data = action.payload.description
            return {...state, ...data }
        default:
            return state;
    }
}

