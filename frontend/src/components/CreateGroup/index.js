import { useState, useEffect } from 'react'
import { createGroup } from '../../store/groups';
import { useHistory } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import './CreateGroup.css'


function CreateGroup() {

    const [errors, setErrors] = useState({});
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('(select one)');
    const [privacy, setPrivacy] = useState('(select one)');
    const [imageUrl, setImageUrl] = useState('');
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect( () => {
        // const city = location.split(',')[0];
        // const state = location.split(',')[1];
        // setErrors(newErrors)
        setLocation(location);
        setName(name);
        setAbout(about);
        setType(type);
        setPrivacy(privacy);
        setImageUrl(imageUrl)
        // console.log(privacy)
    }, [location, name, about, type, privacy, imageUrl])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        console.log('errors 1 => ', errors)
        const city = location.split(',')[0];
        const state = location.split(',')[1];

        let newErrors = {}
        // setErrors(newErrors);
        console.log('errors', errors)
        newErrors = {}
        console.log(privacy)
        console.log('newErrors', newErrors)
        if((city && city.length < 1) || (state && state.length < 1) || city === undefined || state === undefined ) {
            newErrors.location = 'Location is required';
        }
        if(name.length < 1) newErrors.name = 'Name is required';
        console.log('errors 2 =>', errors)
        if(about.length < 30) newErrors.about = 'Description must be at least 30 characters long';
        if(type !== 'In person' && type !== 'Online') newErrors.type = 'Group Type is required';
        if(privacy !== 'true' && privacy !== 'false') newErrors.privacy = 'Visibility Type is required';

        if(!(imageUrl.endsWith('.png') || imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg'))) {
            newErrors.imageUrl = 'Image URL must end in .jpg, .jpeg, or .png'
        }
        console.log('newErr', newErrors)
        // console.log(errors)
        setErrors(newErrors);
        // console.log(errors)

        if (Object.values(newErrors).length > 0) {
            return errors;
        }
        // console.log(privacy)
        // const organizerId
        console.log('Object.values => ', Object.values(errors).length)
        console.log('errors 3 =>', errors)
        console.log('name => ', name)
        if(!Object.values(newErrors).length) {
            const group = await dispatch(createGroup({
                // organizerId,
                city,
                state,
                name,
                about,
                type,
                privacy,
                imageUrl
            }));
            console.log('Group => ', group)
            history.push(`/groups/${group.id}`);
        }
    };



    return (
        <div id='new-group-form-wrapper'>
            <div id='new-group-page-body-wrapper'>
                <h3 id='organizer-header'>START A NEW GROUP</h3>
                <h2 id='walk-through-header'>We'll walk you through a few steps to build your local community</h2>
                <form onSubmit={handleSubmit}>
                    <div className='group-form-section'>
                        <h2 className='group-form-section-header' id='group-location-form-header'>First, set your group's location.</h2>
                        <p>Meetup groups can meet locally, in person, and online. We'll connect you with people
                            <br/>in your area, and more you can join online</p>
                        <input
                        id='group-location-form-field'
                        className='group-form-inputs'
                        type='text'
                        placeholder='City, STATE'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        />
                        {errors.location && (<p className='errors'>{errors.location}</p>)}

                    </div>
                    <div className='group-form-section'>
                        <h2 className='group-form-section-header'>What will your group's name be?</h2>
                        <p>Choose a name that will give people a clear idea of what the group is about.
                            <br/>Feel free to get creative! You can edit this later if you change your mind.</p>
                        <input
                            className='group-form-inputs'
                            type='text'
                            placeholder='What is your group name?'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (<p className='errors'>{errors.name}</p>)}
                    </div>
                    <div className='group-form-section'>
                        <h2 className='group-form-section-header'>Now describe what your group will be about</h2>
                        <p>People will see this when we promote your group, but you'll be able to add to it later, too.
                            <br/><br/>
                            1. What's the purpose of the group?<br/>
                            2. Who should join you?<br/>
                            3. What will you do at your events?</p>
                        {/* <input
                            id='group-form-about-input'
                            className='group-form-inputs'
                            type='textarea'
                            placeholder='Please write at least 30 characters'
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                        /> */}
                        <textarea
                            id='group-form-about-input'
                            className='group-form-inputs'
                            type='textarea'
                            placeholder='Please write at least 30 characters'
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                        />
                        {errors.about && (<p className='errors'>{errors.about}</p>)}
                    </div>
                    <div className='group-form-section'>
                        <h2 className='group-form-section-header'>Final Steps...</h2>
                        <div className='group-form-select-div'>
                            <p>Is this an in person or online group?</p>
                            <select
                                name='type'
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option disabled>
                                (select one)
                                </option>
                                <option>In person</option>
                                <option>Online</option>
                            </select>
                            {errors.type && (<p className='errors'>{errors.type}</p>)}
                        </div>
                        <div className='group-form-select-div'>
                            <p>Is this group private or public?</p>
                            <select
                                onChange={(e) => setPrivacy(e.target.value)}
                                value={privacy}
                            >
                                <option disabled>
                                    (select one)
                                </option>
                                <option onChange={(e) => setPrivacy(e.target.value)} value={true}>Private</option>
                                <option onChange={(e) => setPrivacy(e.target.value)} value={false}>Public</option>
                            </select>
                            {errors.privacy && (<p className='errors'>{errors.privacy}</p>)}
                        </div>
                        <p>Please add an image url for your group below:</p>
                        <input
                            id='group-form-image-url-input'
                            className='group-form-inputs'
                            type='text'
                            placeholder='Image Url'
                            onChange={(e) => setImageUrl(e.target.value)}
                            value={imageUrl}
                        />
                        {errors.imageUrl && (<p className='errors'>{errors.imageUrl}</p>)}
                    </div>
                    <div>
                        <button id='create-group-button' onSubmit={handleSubmit} type='submit'>Create group</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroup;
