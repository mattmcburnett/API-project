import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groups";
import "./GroupsList.css";

function GroupsList({ isLoaded }) {
  const dispatch = useDispatch();
  const groupsState = useSelector((state) => state.groups);
  const groups = Object.values(groupsState);
  console.log("GroupsList:", groups);

  //executing all the code in getAllGroups until dispatch (line 21)
  //then executes that dispatch
  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]); //adding groupsState worked, but bad design

  if (Object.values(groups).length === 0) return null;

  return (
    <div id="main">
        <div id="whole-list-wrapper">
            <div id="grouplist-header-wrapper">
                <div id="header-links">
                    <NavLink to={"/events"}>
                    <h2 className="all-links" id="events-link">
                        Events
                    </h2>
                    </NavLink>
                    <NavLink to={"/groups"}>
                    <h2 className="all-links" id="group-link">
                        Groups
                    </h2>
                    </NavLink>
                </div>
                <h3 id="groups-in-greetup">Groups in GreetUp</h3>
            </div>
        <ul id="groups-list">
            {groups.map((group) => (
            <li key={group.id} className="group-list-item">
                <NavLink className="single-group-link" to={`/groups/${group.id}`}>
                <img src={group.previewImage} className="image" />
                <div className="info">
                    { group.name.length < 30 ?
                        <h3 id="group-name">{group.name}</h3>
                        :
                        <h3 id="group-name">{group.name.slice(0, 30)}...</h3>
                    }
                    <p id="group-location">
                    {group.city}, {group.state}
                    </p>
                    { group.about.length < 50 ?
                        <p id="group-about">{group.about}</p>
                        :
                        <p id="group-about">{group.about.slice(0,235)}...</p>
                    }
                    <div id="events-type">
                    <p>{group.Events.length} event(s)</p>
                    <p>·</p>
                    {group.private === false && <p>Public</p>}
                    {group.private === true && <p>Private</p>}
                    </div>
                </div>
                </NavLink>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
}

export default GroupsList;
