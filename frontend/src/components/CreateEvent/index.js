import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../../store/events';


function CreateEvent() {

    const [errors, setErrors] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState('(select one)');
    const [imageUrl, setImageUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')

    const history = useHistory();
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const groupIdNnumber = Number(groupId)
    const user = useSelector(state => state.session);
    // const group = useSelector(state => state.groups[groupId]) //undefined
    // console.log(group)
    useEffect( () => {

        setName(name);
        setDescription(description);
        setType(type);
        setImageUrl(imageUrl);
        setPrice(price)
        setStartDate(startDate);
        setEndDate(endDate);

    }, [name, description, type, imageUrl, price, startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({})
        // setPrice(Number(price))
        let newErrors = {}
        // console.log('errors', errors)
        newErrors = {}
        console.log('price => ', price)

        // console.log('newErrors', newErrors)
        console.log('startDate => ', startDate)

        if(name.length < 1) newErrors.name = 'Name is required';
        console.log('errors 2 =>', errors)
        if(type !== 'In person' && type !== 'Online') newErrors.type = 'Event Type is required';
        if(!startDate) newErrors.startDate = 'Event start is required';
        if(!endDate) newErrors.endDate = 'Event end is required';
        if(!(imageUrl.endsWith('.png') || imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg'))) {
            newErrors.imageUrl = 'Image URL must end in .jpg, .jpeg, or .png'
        };
        if(description.length < 30) newErrors.description = 'Description must be at least 30 characters long';
        if(price < 1) newErrors.price = 'Price is required';
        console.log('newErr', newErrors)
        // console.log(errors)
        setErrors(newErrors);
        // console.log(errors)



        if (Object.values(newErrors).length > 0) {
            return errors;
        }
        // console.log(privacy)
        // const organizerId
        // console.log('Object.values => ', Object.values(errors).length)
        // console.log('errors 3 =>', errors)
        // console.log('name => ', name)
        if(!Object.values(newErrors).length) {
            const event = await dispatch(createEvent({
                groupId: groupIdNnumber,
                organizerId: user.id,
                venueId: 2,
                name,
                type,
                price,
                description,
                startDate,
                endDate,
                imageUrl
            }));
            console.log('newEvent => ', event)
            history.push(`/events/${event.id}`);
        }
    };

    return (
        <div>
            <h2>Create an event for -GroupName-</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>What is the name of your event?</p>
                    <input
                        type='text'
                        placeholder='Event Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (<p className='errors'>{errors.name}</p>)}
                </div>
                    <div>
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
                    <div>
                        <p>What is the price of your event?</p>
                        <input
                        type='number'
                        placeholder='0'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        >
                        </input>
                        {errors.price && (<p className='errors'>{errors.price}</p>)}
                    </div>
                <div className='start-and-end'>
                    <div>
                        <p>When does your event start?</p>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        {errors.startDate && (<p className='errors'>{errors.startDate}</p>)}
                    </div>
                    <div>
                        <p>When does your event end?</p>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        {errors.endDate && (<p className='errors'>{errors.endDate}</p>)}
                    </div>
                </div>


                <div>
                    <p>Please add an image url for your event below:</p>
                    <input
                        type='text'
                        placeholder='Image Url'
                        onChange={(e) => setImageUrl(e.target.value)}
                        value={imageUrl}
                    />
                    {errors.imageUrl && (<p className='errors'>{errors.imageUrl}</p>)}
                </div>
                <div>
                    <p>Please describe your event:</p>
                    <input
                        type='text-area'
                        placeholder='Please include at least 30 characters'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (<p className='errors'>{errors.description}</p>)}
                </div>

                <div>
                    <button onSubmit={handleSubmit} type='submit'>Create Event</button>
                </div>
            </form>
        </div>
    )

}

export default CreateEvent
