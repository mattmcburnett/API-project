import React from 'react';
import {NavLink} from 'react-router-dom'
import './HomePage.css'

function HomePage() {


    return (
        <div id='home-body'>
          <div id='top-banner'>
            <div>
              <h1>The people platform- <br/> Where interests<br/> become friendships</h1>
              <p>Whatever you like to do, find your people<br/> on GreetUp.
              Connect over hobbies, skills,<br/> and professional interests.
              Events are happening<br/> every day - Log in or sign up to join the fun!
              </p>
            </div>
            <img id='desk-image' src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080'></img>
          </div>
          <div>
            <h2>How GreetUp works</h2>
            <p>We have groups for almost every interest. Meet like-minded
            people <br/> who share your passions. It's free to join.</p>
          </div>
          <div id='icon-wrapper'>
            <div>
              <img src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384'></img>
              <NavLink to='/groups'>See all groups</NavLink>
              <p>Info about See all groups</p>
            </div>
            <div>
              <img src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384'></img>
              <NavLink to='/events'>Find an event</NavLink>
              <p>Info about Find an event</p>
            </div>
            <div>
              <img src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384'></img>
              <NavLink to='/groups/new'>Start a new group</NavLink>
              <p>Info about Start a new group</p>
            </div>
          </div>
          <div>
            <button>Join GreetUp (Add Functionality)</button>
          </div>
        </div>
    )
}

export default HomePage
