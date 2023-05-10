import React, {NavLink, Link} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { groupDetails } from '../../store/groups';
import { useParams } from 'react-router-dom'

import './GroupPage.css';


// handleClick function for joining the group


function GroupPage() {
    const { groupId } = useParams();
    const group = useSelector( state => state.groups[groupId]);
    console.log('group: ',group);

    const dispatch = useDispatch();
    // console.log('groupId: ', parseInt(groupId))

    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId]);

    if(group === undefined) return null
    if (!group.GroupImages) return null

    const groupImages = Object.values(group.GroupImages)
    console.log('GroupImages', groupImages)
    let previewImageUrl;
    groupImages.forEach(image => {
        if(image.preview === true) {
            previewImageUrl = image.url
        }
    });

    return (
        <div id='wrapper'>
            {/* <div><Link to={'/groups'}>Groups</Link></div> */}
            <div id='group-header'>
                <img src={group.previewImage}/>
                <div id='preview-info'>
                    <div id='group-title'><h2>{group.name}</h2></div>
                    <div id='group-subheader'>
                        <h3>{`${group.city}, ${group.state}`}</h3>
                        <h3>## events</h3>
                        <h3>{`Organized by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</h3>
                    </div>
                    <div className='button-div'>
                        <button className='join-button'>Join this group</button>
                    </div>
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
                {/* <NavLink> */}
                <div className='event-preview'>
                    <div className='event-preview-header'>
                        {/* <img></img> */}

                    </div>
                </div>
                {/* </NavLink> */}
            </div>
        </div>
    )


}


export default GroupPage
