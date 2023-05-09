//Action Type Constants
export const LOAD_GROUPS = 'groups/LOAD_GROUPS';
export const ONE_GROUP = 'groups/ONE_GROUP';

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
        default:
            return state;
    }
}

export default groupsReducer;
