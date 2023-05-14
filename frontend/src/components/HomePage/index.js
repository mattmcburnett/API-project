import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import "./HomePage.css";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useSelector } from 'react-redux';

function HomePage() {

  const user = useSelector( state => state.session.user)
  console.log('user', user)
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);

  return (
    <div id="home-body">
      <div id="top-banner">
        <div>
          <h1>
            The people platform- <br /> Where interests
            <br /> become friendships
          </h1>
          <p>
            Whatever you like to do, find your people
            <br /> on GreetUp. Connect over hobbies, skills,
            <br /> and professional interests. Events are happening
            <br /> every day - Log in or sign up to join the fun!
          </p>
        </div>
        <img
          id="desk-image"
          src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
        ></img>
      </div>
      <div id="works">
        <h2 id="works-header">How GreetUp works</h2>
        <p id="works-paragraph">
          We have groups for almost every interest. Meet like-minded people{" "}
          <br /> who share your passions. It's free to join.
        </p>
      </div>
      <div id="icon-wrapper">
        <div className="icon-element">
          <img
            className="icon-image"
            src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
          ></img>
          <NavLink className="icon-link" to="/groups">
          <span className="icon-link-text">See all groups</span>
          </NavLink>
          <p>Info about See all groups</p>
        </div>
        <div className="icon-element">
          <img
            className="icon-image"
            src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
          ></img>
          <NavLink className="icon-link" to="/events">
          <span className="icon-link-text">Find an event</span>
          </NavLink>
          <p>Info about Find an event</p>
        </div>
        <div className="icon-element">
          <img
            className="icon-image"
            src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
          ></img>
          { user ?
            <NavLink className="icon-link" to="/groups/new">
              <span className="icon-link-text">Start a new group</span>
            </NavLink>
            :
            <NavLink id='disabled-link' className="icon-link" to="/">
              <span className="icon-link-text">Start a new group</span>
            </NavLink>
          }
          <p>Info about Start a new group</p>
        </div>
      </div>
      <div>
        {!user ?
          <button id="join-greetup-button">
            <OpenModalMenuItem
              itemText="Join GreetUp"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
        </button>
        :
        <></>
        }
      </div>
    </div>
  );
}

export default HomePage;
