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
    dispatch(loadGroups(groups));
    return groups
    };
};



const initialState = {};

//Reducer

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS:
            const groupsState = {};
            action.groups.forEach(group => {
                groupsState[group.id] = group;
            });
            return groupsState;
        default:
            return state;
    }
}
