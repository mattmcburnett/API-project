import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupsList from "./components/GroupsList";
import GroupPage from "./components/GroupPage";
import HomePage from "./components/HomePage";
import CreateGroup from "./components/CreateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/groups' component={GroupsList} />
        <Route path='/groups/new' component={CreateGroup} />
        <Route path='/groups/:groupId' component={GroupPage} />
      </Switch>}
    </>
  );
}

export default App;
