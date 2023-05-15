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
        <div id='main-group-page-wrapper'>

                <div id='group-page-body-wrapper'>
                    <div id='group-page-breadcrumb-div'>
                        <p>{'<'}</p>
                        <NavLink id='group-page-breadcrumb' to={'/groups'}>Groups</NavLink>
                    </div>
                    <div id='group-page-header'>
                        <div>
                        </div>
                        <img className='group-preview-image-group-page' src={previewImageUrl}/>
                        <div id='group-page-preview-info'>
                            <div id='group-page-highlights-container-div'>
                                <div ><h2 id='group-page-group-title'>{group.name}</h2></div>
                                <div id='group-page-group-subheader'>
                                    <h3 className='group-subheader-content'>{`${group.city}, ${group.state}`}</h3>
                                    <div id='group-page-events-and-privacy'>
                                        <h3 className='group-subheader-content'>{events.length} event(s)</h3>
                                        <h3 className='group-subheader-content'>·</h3>
                                        {group.privacy === true ? <h3 className='group-subheader-content'>Private</h3> : <h3 className='group-subheader-content'>Public</h3> }
                                    </div>
                                    <h3 className='group-subheader-content'>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</h3>
                                </div>
                            </div>
                                {userId === group.organizerId ?
                                    (<div id='group-page-button-container'>
                                        <NavLink to={`/groups/${groupId}/events/new`}><button className='group-page-button'>Create Event</button></NavLink>
                                        <NavLink to={`/groups/${groupId}/edit`}><button className='group-page-button'>Update</button></NavLink>
                                        <OpenModalMenuItem
                                            className='group-page-button'
                                            itemText='Delete'
                                            modalComponent={<DeleteGroupModal groupId={groupId}/>}
                                            isButton={true}
                                        />
                                    </div>)
                                    :
                                    (<div id='group-page-button-container' className='button-div'>
                                    <button className='group-page-button' id='group-page-join-button'>Join this group</button>
                                </div>)
                                }

                        </div>
                    </div>
                    <div id='group-page-bottom-half'>
                        <div className='group-page-group-details-section' id='group-page-group-details'>
                            <div className='group-page-organizer-info'>
                                <h2 className='group-page-details-header'>Organizer</h2>
                                <div id='group-page-organizer-page'>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</div>
                            </div>
                            <div className='group-page-description'>
                                <h2 className='group-page-details-header'>What we're about</h2>
                                <p id='group-page-group-about'>{group.about}</p>
                            </div>
                        </div>
                        <div className='group-page-group-details-section' id='group-events'>

                            {!events.length ?

                                <h2 className='group-page-details-header'>No Upcoming Events</h2>
                                :
                                <div id='upcoming-and-past-div'>

                                    { upcomingEvents.length ?
                                        <div>
                                            <h2 className='group-page-details-header'>Upcoming Events ({upcomingEvents.length}) </h2>
                                            <ul id='group-page-events-list'>
                                                {upcomingEvents.map((event) => (
                                                    <li key={event.id} className='event-list-item'>
                                                        <NavLink className='group-page-event-link' to={`/events/${event.id}`}>
                                                            <div id='group-page-event-header'>
                                                               {event.EventImages.find(image => image.preview === true) !== undefined ?
                                                                    <img id='group-page-event-image' src={event.EventImages.find(image => image.preview === true).url} className='image'/>
                                                                    :
                                                                    <p id='group-page-no-preview'>No preview<br/> image</p>
                                                                }
                                                                <div className='group-page-event-highlights'>
                                                                    <h3 className='group-page-event-date-time'>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</h3>
                                                                    <h2 className='group-page-event-name'>{event.name}</h2>
                                                                    <h3 className='group-page-event-location'>{group.city}, {group.state}</h3>
                                                                </div>
                                                            </div>
                                                            <p id='group-page-event-description'>{event.description}</p>

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
                                            <h2 className='group-page-details-header'>Past Events ({pastEvents.length}) </h2>
                                            <ul id='group-page-events-list'>
                                                {pastEvents.map((event) => (
                                                    <li key={event.id} id='group-page-event-list-item'>
                                                        <NavLink className='group-page-event-link' to={`/events/${event.id}`}>
                                                            <div id='group-page-event-header'>
                                                            {event.EventImages.find(image => image.preview === true) !== undefined ?
                                                                <img id='group-page-event-image' src={event.EventImages.find(image => image.preview === true).url} className='image'/>
                                                                :
                                                                <p id='group-page-no-preview'>No preview <br/>image</p>
                                                            }
                                                                <div className='group-page-event-highlights'>
                                                                    <h3 className='group-page-event-date-time'>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</h3>
                                                                    <h2 className='group-page-event-name'>{event.name}</h2>
                                                                    <h3 className='group-page-event-location'>{group.city}, {group.state}</h3>
                                                                </div>
                                                            </div>
                                                            <p id='group-page-event-description'>{event.description}</p>
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
                </div>
        </div>

    )


}


export default GroupPage
