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

export const oneEvent = (event) => ({
    type: ONE_EVENT,
    event
});

export const addEvent = (event) => ({
    type: ADD_EVENT,
    event
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


export const eventDetails = (eventId) => async (dispatch) => {

    const response = await fetch(`/api/events/${eventId}`)
    if (response.ok) {
        const event = await response.json();
        dispatch(oneEvent(event));
        return event;
    } else {
        const errors = await response.json();
        return errors;
    }

};

export const createEvent = ({name, type, price, startDate, endDate, description, imageUrl, groupId, organizerId, venueId}) => async (dispatch) => {
    console.log('groupId =>', groupId);
    console.log('typeof groupId => ', typeof groupId)
    // console.log(city)
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            groupId: Number(groupId),
            organizerId,
            venueId,
            name,
            type,
            price,
            description,
            startDate,
            endDate,
            capacity: 20
        })
    });
    // console.log('response => ', response)

    if (response.ok) {
        const newEvent = await response.json();
        console.log('newEvent =========> ', newEvent)
        //add image
        const imgRes = await csrfFetch(`/api/events/${newEvent.id}/images`, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: imageUrl,
                eventId: newEvent.id,
                preview: true
            })
        });

        dispatch(addEvent(newEvent));
        return newEvent
    } else {
        // console.log(response)
        //return errors and display
        const errors = await response.json();
        console.log(errors);
        return errors
    }
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
            const singleEvent = action.event
            return {singleEvent}
            // return {...state, [action.event.id]: action.event};
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
