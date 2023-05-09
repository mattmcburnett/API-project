//Action Type Constants
export const LOAD_GROUPS = 'groups/LOAD_GROUPS'

//Action Creators
export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    };
};

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



const initialState = {};

//Reducer

// const normalize = (data) => {
//     return data.reduce((acc, value) => {
//         acc[value.id] = value;
//         return acc;
//     }, {})
// };

const normalize = (data) => {
    const map = {};
    data.forEach(value => {
        map[value.id] = value
    });
    return map;
}

const groupsReducer = (state = initialState, action) => {
    console.log('ACTION LOG: ', action)
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
        default:
            return state;
    }
}

export default groupsReducer;
