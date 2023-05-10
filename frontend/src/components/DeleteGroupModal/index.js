import './DeleteGroupModal.css'
import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import {useParams} from "react-router-dom"


function DeleteGroupModal() {

    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector( state => state.groups[groupId]);
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(deleteGroup(group.id))
    }

    return (
        <div>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to remove this group?</p>
            <button onClick={handleDelete} type='button'>Yes (Delete Group)</button>
            <button type='button'>No (Keep Group)</button>
        </div>
    )
}


export default DeleteGroupModal;
