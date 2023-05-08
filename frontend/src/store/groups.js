const LOAD_GROUPS = 'groups/loadGroups'

export const loadGroups = (groups) => {
    return {
        type: LOAD_GROUPS,
        groups
    };
};

//Thunks

export const fetchGroups = () => async (dispatch) => {
    const response = await fetch('/api/groups');
    const groups = await response.json();
    dispatch(loadGroups(groups))
};



const initialState = {}

//Reducer

const groupsReducer = (state = {}, action) => {
    switch
}
