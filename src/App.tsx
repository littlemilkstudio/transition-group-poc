import React, { useState, useEffect } from "react";
import Cascade, { useCascade, State } from "./transition-group";
import "./App.css";

const App: React.FC = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setKey(v => ++v);
    }, 3000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <Cascade>
      <AnimatedItem key={`key-${key}`} />
    </Cascade>
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
        height: "200px",
        width: "200px",
        backgroundColor: "blue",
        color: "white",
        fontSize: "20px",
        transition: "1s all ease",
        opacity: `${cascade.state === State.exit ? 0 : 1}`,
        transform: `translateX(${
          cascade.state === State.exit
            ? 0
            : cascade.state === State.enter || cascade.state === State.idle
            ? 800
            : 0
        }px)`
      }}
      onTransitionEnd={() => cascade.onTransitionEnd()}
    >
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
        transition: "2s all ease",
        opacity: `${cascade.state === State.exit ? 0 : 1}`,
        transform: `translateY(${
          cascade.state === State.exit
            ? 0
            : cascade.state === State.enter || cascade.state === State.idle
            ? 800
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
