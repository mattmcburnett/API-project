import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import './EventsList.css'
import { getAllEvents } from '../../store/events';

function EventsList({isLoaded}) {

    const dispatch = useDispatch();
    const eventsState = useSelector( state => state.events );
    const events = Object.values(eventsState);

    console.log("EventsList:", events);

    useEffect(() => {
        dispatch(getAllEvents());
    }, [dispatch])

    if(Object.values(events).length === 0) return null

    return (
        <div id='main'>
            <div id='header-links'>
                <NavLink to={'/events'}><h2 className='all-links'>Events</h2></NavLink>
                <NavLink to={'/groups'}><h2 className='all-links'>Groups</h2></NavLink>
            </div>
            <h3>Events in GreetUp</h3>
            <ul id='events-list'>
                {events.map((event) => (
                    <li key={event.id} className='event-list-item'>
                        <NavLink className='event-link' to={`/events/${event.id}`}>
                            <img src={event.previewImage} className='image'/>
                            <div className='info'>
                                <h3>{event.startDate}</h3>
                                <h2>{event.name}</h2>
                                <h3>Location - TODO</h3>
                                {/* <h3>{group.city}, {group.state}</h3> */}
                                <p>{event.description}</p>
                            </div>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventsList;
