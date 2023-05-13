import './DeleteGroupModal.css';
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import {useParams, useHistory} from "react-router-dom";
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
        <div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to remove this group?</p>
            <button onClick={handleDelete} type='button'>Yes (Delete Group)</button>
            <button onClick={backToGroup} type='button'>No (Keep Group)</button>
        </div>
    )
}


export default DeleteGroupModal;
