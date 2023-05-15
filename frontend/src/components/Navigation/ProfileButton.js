import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button id="profile-button" onClick={openMenu}>
        <i id='profile-circle' className="fas fa-user-circle fa-2x" />

      </button>
      {showMenu === false ?
          <i className="fa-solid fa-angle-up"></i>
          :
          <i className="fa-solid fa-angle-down"></i>
        }
      <ul className={ulClassName} id="dropdown menu" ref={ulRef}>
        {user ? (
          <div id="profile-dropdown">
            <p>Hello, {user.firstName}</p>
            <p>{user.email}</p>
            <div>
              <button id="logout-button" onClick={logout}>Log Out</button>
            </div>
            <div>
              <Link className='dropdown-links' to='/groups'>View Groups</Link>
            </div>
            <div>
              <Link className='dropdown-links' to='/events'>View Events</Link>
            </div>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
