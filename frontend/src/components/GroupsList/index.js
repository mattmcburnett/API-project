import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllGroups } from '../../store/groups';
import './GroupsList.css';

function GroupsList({isLoaded}) {

    const dispatch = useDispatch();
    const groupsState = useSelector( state => state.groups );
    const groups = Object.values(groupsState);

    console.log("GroupsList:", groups);


    //executing all the code in getAllGroups until dispatch (line 21)
    //then executes that dispatch
    useEffect(() => {
        dispatch(getAllGroups());
    }, [dispatch])

    if(Object.values(groups).length === 0) return null

    return (
        <div id='main'>
            <div id='header-links'>
                <NavLink to={'/events'}><h2 className='all-links'>Events</h2></NavLink>
                <NavLink to={'/groups'}><h2 className='all-links'>Groups</h2></NavLink>
            </div>
            <h3>Groups in GreetUp</h3>
            <ul id='groups-list'>
                {groups.map((group) => (
                    <li key={group.id} className='group-list-item'>
                        <NavLink className='group-link' to={`/groups/${group.id}`}>
                            <img src={group.previewImage} className='image'/>
                            <div className='info'>
                                <h2>{group.name}</h2>
                                <h3>{group.city}, {group.state}</h3>
                                <p>{group.about}</p>
                                <div>
                                    <h3># of Events - Still to Do*</h3>
                                    {group.private === false && (<h3>Public</h3>)}
                                    {group.private === true && (<h3>Private</h3>)}
                                    {console.log(group.private)}
                                </div>
                            </div>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default GroupsList;
