import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);





  return (
    <div id='nav-bar-wrapper'>
     <div id='nav-bar'>
        <div id='greetup-logo'>
          <NavLink id='greetup-logo' exact to="/"><p>GreetUp</p></NavLink>
        </div>
        {sessionUser === null ?
          <ul>
            <li className='nav-links'>
              <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              />
            </li>
            <li className='nav-links'>
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </ul>
          :
          <li id='profile-li'>
            <NavLink id='start-group' to={'groups/new'}>Start a new group</NavLink>
            <ProfileButton user={sessionUser} />
          </li>
        }

      </div>
    </div>
  );
}


export default Navigation;
