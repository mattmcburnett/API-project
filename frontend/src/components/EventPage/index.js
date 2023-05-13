import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { groupDetails } from '../../store/groups';
import { useParams, NavLink, Link } from 'react-router-dom'
import { eventDetails } from '../../store/events';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteEventModal from '../DeleteEventModal';


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
        <div id='wrapper'>
            <div id='event-header'>
                <div className='breadcrumb-div'>
                    <p>{'<'}</p>
                    <NavLink className='breadcrumb-link' to={'/events'}>Events</NavLink>
                </div>
                <div>
                    <h2>{event.name}</h2>
                    <h4>Hosted by {event.Group.User.firstName} {event.Group.User.lastName}</h4>
                </div>
            </div>
            <div className='event-details'>
                <div className='event-detail-blocks'>
                    <NavLink to={`/groups/${event.Group.id}`}>
                        <img src={eventImageUrl}/>
                        <div className='event-group-info'>
                            <img src={groupPreviewImageUrl}/>
                            <h4 className='event-group-name'>{event.Group.name}</h4>
                            {event.Group.private === +true ?
                                <p>Private</p>
                                :
                                <p>Public</p>
                            }
                        </div>
                    </NavLink>
                    <div className='event-highlights'>
                        <div className='event-time'>
                            <p>time icon</p>
                            <p>START {event.startDate}-dateTODO · {event.startDate}-timeTODO</p>
                            <p>END {event.endDate}-dateTODO · {event.endDate}-timeTODO</p>
                        </div>
                        <div className='event-price'>
                            <p>price icon</p>
                            {event.price === 0 ?
                                <p>FREE</p>
                                :
                                <p>{event.price}</p>
                            }
                        </div>
                        <div className='event-location'>
                            <p>location icon</p>
                            <p>{`${group.city}, ${group.state}`}</p>
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
                    <div event-details>
                        <h2>Details</h2>
                        <p>{event.description}</p>
                    </div>

                </div>
            </div>

        </div>
    )


}


export default EventPage
