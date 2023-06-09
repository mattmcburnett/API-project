import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupsList from "./components/GroupsList";
import GroupPage from "./components/GroupPage";
import HomePage from "./components/HomePage";
import CreateGroup from "./components/CreateGroup";
import EditGroup from "./components/EditGroup";
import EventsList from "./components/EventsList";
import EventPage from "./components/EventPage";
import CreateEvent from "./components/CreateEvent";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  //set up 404 page

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route exact path='/groups' component={GroupsList}/>
        <Route path='/groups/new' component={CreateGroup}/>
        <Route exact path='/groups/:groupId' component={GroupPage}/>
        <Route path='/groups/:groupId/edit' component={EditGroup}/>
        <Route exact path='/events' component={EventsList}/>
        <Route exact path='/events/:eventId' component={EventPage}/>
        <Route exact path='/groups/:groupId/events/new' component={CreateEvent}/>
      </Switch>}
    </>
  );
}

export default App;
