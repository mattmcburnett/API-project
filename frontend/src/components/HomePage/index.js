import React from 'react';
import {NavLink} from 'react-router-dom'
import './HomePage.css'

function HomePage() {


    return (
        <div id='home-body'>
          <div id='top-banner'>
            <div>
              <h1>The people platform- <br/> Where interests<br/> become friendships</h1>
              <p>Fill in info about GreetUp here</p>
            </div>
            <img></img>
          </div>
          <div>
            <h2>How GreetUp works</h2>
            <p>This is how GreetUp works</p>
          </div>
          <div id='icon-wrapper'>
            <div>
              <img></img>
              <NavLink to='/groups'>See all groups</NavLink>
              <p>Info about See all groups</p>
            </div>
            <div>
              <img></img>
              <NavLink to='/events'>Find an event</NavLink>
              <p>Info about Find an event</p>
            </div>
            <div>
              <img></img>
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
