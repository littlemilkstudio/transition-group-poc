import React from "react";
import Cascade, { useCascade, State } from "./transition-group";
import { useLocation, Switch, Route, Link } from "react-router-dom";
import "./App.css";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}
    >
      <Link to="/">Home</Link>
      <br />
      <Link to="/about">About</Link>
      <Cascade>
        <Switch key={location.key}>
          <Route exact path="/" component={AnimatedItem} />
          <Route path="/about" component={AnimatedItem} />
        </Switch>
      </Cascade>
    </div>
  );
};

const AnimatedItem = () => {
  const cascade = useCascade();
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 100
        }px`,
        width: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 100
        }px`,
        backgroundColor: "blue",
        color: "white",
        fontSize: "20px",
        transition: "0.3s all ease",
        opacity: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 1
        }`,
        transitionDelay: [State.enter].includes(cascade.state) ? "0.3s" : "0s",
        transform: `translateX(${
          [State.exit, State.exited].includes(cascade.state)
            ? 0
            : [State.enter, State.idle].includes(cascade.state)
            ? 200
            : 0
        }px)`
      }}
      onTransitionEnd={() => cascade.onTransitionEnd()}
    >
      {cascade.state}
      <AnimatedSubItem />
    </div>
  );
};

const AnimatedSubItem = () => {
  const cascade = useCascade();
  return (
    <div
      style={{
        position: "absolute",
        height: "50px",
        width: "50px",
        backgroundColor: "red",
        color: "white",
        fontSize: "20px",
        transition: "0.3s all ease",
        opacity: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 1
        }`,
        transitionDelay: [State.enter].includes(cascade.state) ? "0.3s" : "0s",
        transform: `translateY(${
          [State.exit, State.exited].includes(cascade.state)
            ? 0
            : [State.enter, State.idle].includes(cascade.state)
            ? 300
            : 0
        }px)`
      }}
      onTransitionEnd={() => cascade.onTransitionEnd()}
    >
      {cascade.state}
    </div>
  );
};

export default App;
