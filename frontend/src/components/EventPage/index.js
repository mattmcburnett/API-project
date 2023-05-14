import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { groupDetails } from '../../store/groups';
import { useParams, NavLink } from 'react-router-dom'
import { eventDetails } from '../../store/events';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteEventModal from '../DeleteEventModal';
import './EventPage.css'



function EventPage() {
    const { eventId } = useParams();
    const event = useSelector( state => state.events.singleEvent);

    console.log('event => ', event);

    const dispatch = useDispatch();
    // console.log('groupId: ', parseInt(groupId))
    const user = useSelector(state => state.session.user)
    // console.log('User => ', user)
    let userId;
    if (user) {
        userId = user.id
    } else {
        userId = null
    };

    useEffect(() => {
        dispatch(eventDetails(eventId))
    }, [dispatch, eventId]);

    if(event === undefined) return null
    // if (!group.GroupImages) return null

    // const group = useSelector( state => state)

    console.log(event)

    const eventImages = event.EventImages;
    console.log('eventImages -> ', eventImages)
    let eventImageUrl;
    eventImages.forEach(image => {
        if(image.preview === true) {
            eventImageUrl = image.url
        }
    });
    console.log('eventImageUrl -> ', eventImageUrl)


    const groupImages = Object.values(event.Group.GroupImages)
    // console.log('GroupImages', groupImages)
    let groupPreviewImageUrl;
    groupImages.forEach(image => {
        if(image.preview === true) {
            groupPreviewImageUrl = image.url
        }
    });
    console.log('groupPreviewImageUrl => ', groupPreviewImageUrl);



    const group = event.Group;
    console.log('group => ', group)



    return (
        <div id='event-page-wrapper'>
            <div id='event-page-body-wrapper'>
                <div id='event-page-event-header-wrapper'>
                    <div id='event-page-event-header'>
                        <div id='event-page-breadcrumb-div'>
                            <p>{'<'}</p>
                            <NavLink className='event-page-breadcrumb-link' to={'/events'}>Events</NavLink>
                        </div>
                        <div>
                            <h2 id='event-page-event-name'>{event.name}</h2>
                            <h4 id='event-name-event-host'>Hosted by {event.Group.User.firstName} {event.Group.User.lastName}</h4>
                        </div>
                    </div>
                </div>
                <div className='event-page-event-details'>
                    <div id='event-page-event-details-wrapper'>
                        <div className='event-page-event-detail-blocks'>
                            <img id='event-page-event-image' src={eventImageUrl}/>
                            <div id='event-page-event-detail-blocks-right'>
                                <NavLink to={`/groups/${event.Group.id}`}>
                                    <div className='event-page-event-group-info'>
                                        <img id='event-page-group-image' src={groupPreviewImageUrl}/>
                                        <div id='event-page-group-details-div'>
                                            <h4 className='event-page-event-group-name'>{event.Group.name}</h4>
                                            {event.Group.private === +true ?
                                                <p className='event-page-group-type'>Private</p>
                                                :
                                                <p className='event-page-group-type'>Public</p>
                                            }
                                        </div>
                                    </div>
                                </NavLink>
                                <div className='event-page-event-highlights'>
                                    <div className='event-page-event-time'>
                                        <i className="fa-regular fa-clock"></i>
                                        <div id='event-page-start-end-times'>
                                            <div>
                                                <p className='event-page-start-end-label'>START</p>
                                                <p className='event-page-start-end-label'>END</p>
                                            </div>
                                            <div>
                                                <p className='event-page-start-end'>{event.startDate.split('T')[0]} · {event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.startDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</p>
                                                <p className='event-page-start-end'>{event.endDate.split('T')[0]} · {event.endDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[0]}:{event.endDate.split('T')[1].split('Z')[0].split('.')[0].split(':')[1]}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='event-page-event-price'>
                                        <i class="fa-solid fa-dollar-sign"></i>
                                        {event.price === 0 ?
                                            <p>FREE</p>
                                            :
                                            <p>{event.price}</p>
                                        }
                                    </div>
                                    <div id='event-page-event-location-div-wrapper'>
                                        <div className='event-page-event-location-div'>
                                            <i className="fa-solid fa-map-pin"></i>
                                            <p className='event-page-event-location'>{`${group.city}, ${group.state}`}</p>
                                        </div>
                                        <div>
                                            {userId === group.organizerId ?
                                                <OpenModalMenuItem
                                                itemText='Delete'
                                                modalComponent={<DeleteEventModal eventId={eventId}/>}
                                                isButton={true}
                                                />
                                                :
                                                <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div event-details>
                                <h2 id='event-page-event-description-header'>Details</h2>
                                <p id='event-page-event-description'>{event.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}


export default EventPage
