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
            <div id='list-wrapper'>
                <div id='header-wrapper'>
                    <div id='header-links'>
                        <NavLink to={'/events'}><h2 className='all-links' id='events-event-link'>Events</h2></NavLink>
                        <NavLink to={'/groups'}><h2 className='all-links' id='events-groups-link'>Groups</h2></NavLink>
                    </div>
                    <h3 id='events-in-greetup'>Events in GreetUp</h3>
                </div>
                <ul id='events-list'>
                    {events.map((event) => (
                        <li key={event.id} className='event-list-item'>
                            <NavLink className='event-link' to={`/events/${event.id}`}>
                                <div id='event-highlights'>
                                    <img src={event.previewImage} className='image'/>
                                    <div>
                                        <div className='info'>
                                            <h3 id='start-date-and-time'>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</h3>
                                            <h2 id='event-name'>{event.name}</h2>
                                            <h3 id='event-location'>{event.Group.city}, {event.Group.state}</h3>
                                        </div>
                                    </div>
                                </div>
                                <p id='event-description'>{event.description}</p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default EventsList;
