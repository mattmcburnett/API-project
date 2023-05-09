import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import './GroupPage.css';


function GroupPage() {
    const { groupId } = useParams();
    const group = useSelector( state => state.groups[groupId]);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch() //put in 
    })


}


export default GroupPage
