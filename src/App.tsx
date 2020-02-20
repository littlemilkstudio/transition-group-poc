import React, { useState, useEffect } from "react";
import Cascade, { useCascade, State } from "./transition-group";
import "./App.css";

const App: React.FC = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setKey(v => (v < 6 ? (v += 1) : v));
    }, 3000);

    return () => {
      clearInterval(id);
    };
  }, []);

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
      <Cascade>
        <AnimatedItem key={`key-${key}`} />
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
        transition: "5s all ease",
        opacity: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 1
        }`,
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
        transition: "7s all ease",
        opacity: `${
          [State.exit, State.exited].includes(cascade.state) ? 0 : 1
        }`,
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
