import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllGroups } from '../../store/groups';

function GroupsList({isLoaded}) {

    const dispatch = useDispatch();
    // console.log(state)
    const groups = useSelector((state) => Object.values(state.Groups));

    useEffect(() => {
        dispatch(getAllGroups())
    })

    return (
        <div>
            <div>
                <h2>Events</h2>
                <h2>Groups</h2>
            </div>
            <h3>Groups in GreetUp</h3>
            <ul id='groups-list'>
                {Object.values(groups).map(({ id, name, city, state, previewImage}))}
                    <li key={id} className='group-list-item'>
                        <NavLink>
                            <img src={previewImage}/>
                            <div>
                                <h2>{name}</h2>
                                <h3>{city}, {state}</h3>
                                <p>{about}</p>
                                <div>
                                    <h3># of Events - Still to Do*</h3>
                                    {/* <h3>{private} - write conditional</h3> */}
                                </div>
                            </div>
                        </NavLink>
                    </li>
            </ul>
        </div>
    )
}

export default GroupsList;
