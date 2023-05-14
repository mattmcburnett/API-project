import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { groupDetails } from '../../store/groups';
import { useParams, NavLink, Link } from 'react-router-dom'
// import OpenDeleteGroupModal from '../DeleteGroupModal/OpenDeleteGroupModal';
import DeleteGroupModal from '../DeleteGroupModal';
import './GroupPage.css';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';


function GroupPage() {
    const { groupId } = useParams();
    const group = useSelector( state => state.groups[groupId]);
    console.log('group => ',group);

    // const params = useParams();
    // console.log('params ->', params)


    const dispatch = useDispatch();
    // console.log('groupId: ', parseInt(groupId))
    const user = useSelector(state => state.session.user)
    console.log('User => ', user)
    let userId
    if(user) {
        userId = user.id;
    } else {
        userId = null
    }
    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId]);

    if(group === undefined) return null
    if (!group.GroupImages) return null

    const groupImages = Object.values(group.GroupImages)
    // console.log('GroupImages', groupImages)
    let previewImageUrl;
    groupImages.forEach(image => {
        if(image.preview === true) {
            previewImageUrl = image.url
        }
    });
    console.log('previewImageUrl => ', previewImageUrl);

    const events = group.Events;
    console.log('events => ', events)
    const currentDate = Date.now();
    console.log('currentDate =>', currentDate);
    const upcomingEvents = [];
    const pastEvents = [];

    events.forEach(event => {
        // console.log(Date.parse(event.startDate))
        if (Date.parse(event.startDate) >= currentDate) {
            upcomingEvents.push(event)
        } else {
            pastEvents.push(event)
        }
    })
    console.log('upcoming events =====> ', upcomingEvents)
    console.log('past events =====> ', pastEvents)



    return (
        <div id='wrapper'>
            <div id='group-header'>
                <div>
                    <p>{'<'}</p>
                    <NavLink id='breadcrumb' to={'/groups'}>Groups</NavLink>
                </div>
                <img className='group-preview-image' src={previewImageUrl}/>
                <div id='preview-info'>
                    <div id='group-title'><h2>{group.name}</h2></div>
                    <div id='group-subheader'>
                        <h3>{`${group.city}, ${group.state}`}</h3>
                        <h3>{events.length} event(s)</h3>
                        <h3>·</h3>
                        {group.privacy === true ? <h3>Private</h3> : <h3>Public</h3> }
                        <h3>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</h3>
                    </div>

                    {userId === group.organizerId ?
                        (<div>
                            <NavLink to={`/groups/${groupId}/events/new`}><button className='action-buttons'>Create Event</button></NavLink>
                            <NavLink to={`/groups/${groupId}/edit`}><button className='action-buttons'>Update</button></NavLink>
                            <OpenModalMenuItem
                                itemText='Delete'
                                modalComponent={<DeleteGroupModal groupId={groupId}/>}
                                isButton={true}
                            />
                        </div>)
                        :
                        (<div className='button-div'>
                        <button className='join-button'>Join this group</button>
                    </div>)
                    }
                </div>
            </div>
            <div className='group-details'>
                <div className='organizer-info'>
                    <h2>Organizer</h2>
                    <div>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</div>
                </div>
                <div className='description'>
                    <h2>What we're about</h2>
                    <p>{group.about}</p>
                </div>
            </div>
            <div className='group-events'>

                {!events.length ?

                    <h2>No Upcoming Events</h2>
                    :
                    <div id='upcoming-and-past-div'>

                        { upcomingEvents.length ?
                            <div>
                                <h2>Upcoming Events ({upcomingEvents.length}) </h2>
                                <ul id='events-list'>
                                    {upcomingEvents.map((event) => (
                                        <li key={event.id} className='event-list-item'>
                                            <NavLink className='event-link' to={`/events/${event.id}`}>
                                                <img src={'event.EventImages.find(image => image.preview === true).url'} className='image'/>
                                                <div className='info'>
                                                    <h3>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</h3>
                                                    <h2>{event.name}</h2>
                                                    <h3>{group.city}, {group.state}</h3>
                                                    <p>{event.description}</p>
                                                </div>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            :
                            <></>
                        }

                        { pastEvents.length ?
                            <div>
                                <h2>Past Events ({pastEvents.length}) </h2>
                                <ul id='events-list'>
                                    {pastEvents.map((event) => (
                                        <li key={event.id} className='event-list-item'>
                                            <NavLink className='event-link' to={`/events/${event.id}`}>
                                                <img src={'event.EventImages.find(image => image.preview === true).url'} className='image'/>
                                                <div className='info'>
                                                    <h3>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</h3>
                                                    <h2>{event.name}</h2>
                                                    <h3>{group.city}, {group.state}</h3>
                                                    <p>{event.description}</p>
                                                </div>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            :
                            <></>
                        }

                    </div>





                }
            </div>
        </div>
    )


}


export default GroupPage
