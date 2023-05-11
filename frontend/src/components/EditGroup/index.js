import { useState, useEffect } from 'react'
import { createGroup, groupDetails } from '../../store/groups';
import { useHistory, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';



function EditGroup() {
    const dispatch = useDispatch();

    const { groupId } = useParams();
    console.log('groupId => ', groupId) //this works

    useEffect(() => {
        dispatch(groupDetails(groupId))
    }, [dispatch, groupId]);


    let originalGroup = useSelector( state => state.groups[groupId]);
    console.log('originalGroup =>', originalGroup) //undefined


    const [errors, setErrors] = useState({});
    const [location, setLocation] = useState(`${originalGroup.city}, ${originalGroup.state}`);
    const [name, setName] = useState(originalGroup.name);
    const [about, setAbout] = useState(originalGroup.about);
    const [type, setType] = useState(originalGroup.type);
    const [privacy, setPrivacy] = useState(originalGroup.privacy);
    // const [imageUrl, setImageUrl] = useState('');
    const history = useHistory();

    useEffect( () => {

        setLocation(location);
        setName(name);
        setAbout(about);
        setType(type);
        setPrivacy(privacy);

    }, [location, name, about, type, privacy])
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        console.log('errors 1 => ', errors)
        const city = location.split(',')[0];
        const state = location.split(',')[1];

        let newErrors = {}
        newErrors = {}

        if((city && city.length < 1) || (state && state.length < 1) || city === undefined || state === undefined ) {
            newErrors.location = 'Location is required';
        }
        if(name.length < 1) newErrors.name = 'Name is required';
        if(about.length < 30) newErrors.about = 'Description must be at least 30 characters long';
        if(type !== 'In person' && type !== 'Online') newErrors.type = 'Group Type is required';
        if(privacy !== 'true' && privacy !== 'false') newErrors.privacy = 'Visibility Type is required';

        setErrors(newErrors);

        if (Object.values(newErrors).length > 0) {
            return errors;
        }

        console.log('Object.values => ', Object.values(errors).length)
        console.log('errors 3 =>', errors)
        console.log('name => ', name)
        if(!Object.values(newErrors).length) {
            const updates = {}
            const group = await dispatch(createGroup({
                city,
                state,
                name,
                about,
                type,
                privacy,
            }));
            console.log('Group => ', group)
            history.push(`/groups/${group.id}`);
        }
    };



    return (
        <div>
            <p>UPDATE YOUR GROUP'S INFORMATION</p>
            <h2>We'll walk you through a few steps to update your group's information</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>First, set your group's location.</h2>
                    <p>Meetup groups can meet locally, in person, and online. We'll connect you with people
                        <br/>in your area, and more you can join online</p>
                    <input
                    type='text'
                    placeholder='City, STATE'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && (<p className='errors'>{errors.location}</p>)}

                </div>
                <div>
                    <h2>What will your group's name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about.
                        <br/>Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        type='text'
                        placeholder='What is your group name?'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (<p className='errors'>{errors.name}</p>)}
                </div>
                <div>
                    <h2>Now describe what your group will be about</h2>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.
                        <br/><br/>
                        1. What's the purpose of the group?<br/>
                        2. Who should join you?<br/>
                        3. What will you do at your events?</p>
                    <input
                        type='text-area'
                        placeholder='Please write at least 30 characters'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    {errors.about && (<p className='errors'>{errors.about}</p>)}
                </div>
                <div>
                    <h2>Final Steps...</h2>
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
                <div>
                    <button onSubmit={handleSubmit} type='submit'>Update group</button>
                </div>
            </form>
        </div>
    )
}

export default EditGroup;
