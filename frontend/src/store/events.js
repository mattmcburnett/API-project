import { csrfFetch } from "./csrf";


//Action Type Constants
export const LOAD_EVENTS = 'events/LOAD_EVENTS';
export const ONE_EVENT = 'events/ONE_EVENT';
export const ADD_EVENT = 'events/ADD_EVENT';
export const REMOVE_EVENT = 'events/REMOVE_EVENT';
export const EDIT_EVENT = 'events/EDIT_EVENTS'


//Action Creators
export const loadEvents = (events) => ({
    type: LOAD_EVENTS,
    events
});



//Thunk Action Creators
export const getAllEvents = () => async (dispatch) => {

    const response = await fetch('/api/events');

    if(response.ok) {
    const events = await response.json();
    console.log('get all events: ', events)
    dispatch(loadEvents(events));
    return events
    };
};


const initialState = {};

const normalize = (data) => {
    const map = {};
    data.forEach(value => {
        map[value.id] = value
    });
    return map;
}

const eventsReducer = (state = initialState, action) => {
    // console.log('ACTION LOG: ', action)
    const newState = {...state};

    switch (action.type) {
        case LOAD_EVENTS:
            const eventsState = normalize(action.events.Events);
            return eventsState;
        case ONE_EVENT:
            return {...state, [action.event.id]: action.event};
        case ADD_EVENT:
            return {...state, [action.event.id]: action.event};
        case REMOVE_EVENT:
            delete newState[action.eventId];
            return newState;
        case EDIT_EVENT:
            return {...state, [action.event.id]: action.event};
        default:
            return state;
    }
}

export default eventsReducer;
