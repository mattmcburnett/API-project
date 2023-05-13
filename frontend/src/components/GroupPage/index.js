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

    return (
        <div id='wrapper'>
            <div id='group-header'>
                <div>
                    <p>{'<'}</p>
                    <NavLink id='breadcrumb' to={'/groups'}>Groups</NavLink>
                </div>
                <img src={previewImageUrl}/>
                <div id='preview-info'>
                    <div id='group-title'><h2>{group.name}</h2></div>
                    <div id='group-subheader'>
                        <h3>{`${group.city}, ${group.state}`}</h3>
                        <h3>{events.length}</h3>
                        <h3>·</h3>
                        {group.privacy === true ? <h3>Private</h3> : <h3>Public</h3> }
                        <h3>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</h3>
                    </div>

                    {user.id === group.organizerId ?
                        (<div>
                            <button className='action-buttons'>Create Event</button>
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
                <h2>Upcoming Events (# - todo)</h2>

                <h2>Past Events (# - todo)</h2>

            </div>
        </div>
    )


}


export default GroupPage
