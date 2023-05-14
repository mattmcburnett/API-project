import './DeleteEventModal.css';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {useParams, useHistory} from "react-router-dom";
import { deleteEvent } from '../../store/events';


function DeleteEventModal({eventId}) {
    const history = useHistory()
    const dispatch = useDispatch();
    const params = useParams();
    const event = useSelector(state => state.events.singleEvent);
    // console.log('event=====> ', event)

    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();

        history.push(`/groups/${event.Group.id}`)
        return (dispatch(deleteEvent(event.id))
            .then(closeModal)
        )
    }

    const backToEvent = (e) => {
        e.preventDefault();
        closeModal();
    }

    return (
        <div id='event-page-delete-event-modal-form'>
            <h3 id='confirm-delete-event-header'>Confirm Delete</h3>
            <p id='delete-event-sure'>Are you sure you want to remove this event?</p>
            <div className='event-page-delete-event-modal-buttons'>
                <button id='event-page-delete-event-button' onClick={handleDelete} type='button'>Yes (Delete Event)</button>
                <button id='event-page-keep-event-button' onClick={backToEvent} type='button'>No (Keep Event)</button>
            </div>
        </div>
    )


}

export default DeleteEventModal;
