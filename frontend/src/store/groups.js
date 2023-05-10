import { csrfFetch } from "./csrf";

//Action Type Constants
export const LOAD_GROUPS = 'groups/LOAD_GROUPS';
export const ONE_GROUP = 'groups/ONE_GROUP';
export const ADD_GROUP = 'groups/ADD_GROUP';
export const REMOVE_GROUP = 'groups/REMOVE_GROUP';

//Action Creators
export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    };
};

export const oneGroup = (group) => ({
    type: ONE_GROUP,
    group
});

export const addGroup = (group) => ({
    type: ADD_GROUP,
    group
})

export const removeGroup = (group) => ({
    type: REMOVE_GROUP,
    group
})

//Thunk Action Creators

export const getAllGroups = () => async (dispatch) => {

    const response = await fetch('/api/groups');

    if(response.ok) {
    const groups = await response.json();
    console.log('get all groups groups: ',groups)
    dispatch(loadGroups(groups));
    return groups
    };
};

export const groupDetails = (groupId) => async (dispatch) => {

    const response = await fetch(`/api/groups/${groupId}`)
    if (response.ok) {
        const group = await response.json();
        dispatch(oneGroup(group));
        return group;
    } else {
        const errors = await response.json();
        return errors;
    }

};

export const createGroup = ({city, state, name, about, type, privacy}) => async (dispatch) => {

    // console.log(city)
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            city,
            state,
            name,
            about,
            type,
            private: privacy
        })
    });
    // console.log('response => ', response)

    if (response.ok) {
        const newGroup = await response.json();
        dispatch(addGroup(newGroup));
        // return newGroup
    } else {
        // console.log(response)
        //return errors and display
        const errors = await response.json();
        console.log(errors);
        return errors
    }
}

export const deleteGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeGroup(groupId))
    } else {
        const errors = await response.json();
        return errors;
      }
}


const initialState = {};

//Reducer

//data normalizing function
const normalize = (data) => {
    const map = {};
    data.forEach(value => {
        map[value.id] = value
    });
    return map;
}

const groupsReducer = (state = initialState, action) => {
    // console.log('ACTION LOG: ', action)
    switch (action.type) {
        case LOAD_GROUPS:
            // const groupsState = [];
            // console.log('action.groups: ',action.groups)
            // action.groups.Groups.forEach(group => {
            //     console.log('justin log', group)
            //     groupsState.push(group);
            // });
            // console.log( 'GroupState: ' ,groupsState)
            const groupsState = normalize(action.groups.Groups);
            return groupsState;
        case ONE_GROUP:
            // console.log(action.group)
            return {...state, [action.group.id]: action.group };
        case ADD_GROUP:
            return {...state, [action.group.id]: action.group};
        case REMOVE_GROUP:
            const newState = {...state};
            delete newState[action.groupId];
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;
