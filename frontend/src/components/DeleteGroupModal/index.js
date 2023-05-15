import './DeleteGroupModal.css';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {useHistory, Redirect} from "react-router-dom";
import { deleteGroup } from '../../store/groups';


function DeleteGroupModal({groupId}) {
    const history = useHistory()
    const dispatch = useDispatch();
    // const { groupId } = useParams();
    // const params = useParams();
    // console.log('params => ', params)
    // console.log('groupId =>', groupId)
    const groups = useSelector( state => state.groups); //get groups on its own
    console.log('Groups => ', groups)
    const group = groups[groupId] //key into group
    // console.log(group)

    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();

        history.push('/groups')
        return (dispatch(deleteGroup(group.id))
            .then(closeModal)
        )
    };

    const backToGroup = (e) => {
        e.preventDefault();
        closeModal();
    };

    return (
        <div id='group-page-delete-group-modal-form'>
            <h3 id='confirm-delete-group-header'>Confirm Delete</h3>
            <p id='delete-group-sure'>Are you sure you want to remove this group?</p>
            <div id='group-page-delete-group-modal-buttons'>
                <button id='group-page-delete-group-button' onClick={handleDelete} type='button'>Yes (Delete Group)</button>
                <button id='group-page-keep-group-button' onClick={backToGroup} type='button'>No (Keep Group)</button>
            </div>
        </div>
    )
}


export default DeleteGroupModal;
