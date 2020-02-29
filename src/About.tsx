import React from "react";
import { useCascade, State } from "./transition-group";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Item = styled.li<{ index: number }>`
  display: block;
  transition: all 1s ease;
  transition-delay: ${p => p.index * 0.2}s;
  &[data-state=${State.preEnter}] {
    opacity: 1;
    transform: translateY(200px);
  }
  &[data-state=${State.enter}] {
    opacity: 1;
    transform: translateY(0px);
  }
  &[data-state=${State.exit}], &[data-state=${State.exited}] {
    transform: translateY(50px);
    opacity: 0;
  }
`;

export default () => {
  const cascade1 = useCascade();
  const cascade2 = useCascade();
  const cascade3 = useCascade();
  const cascade4 = useCascade();

  return (
    <div>
      <h2>About</h2>
      <ul>
        <Item
          data-state={cascade1.state}
          onTransitionEnd={() => cascade1.onTransitionEnd()}
          index={1}
        >
          <Link to="/">Home</Link>
          <p>Some generic description about the about page. About.</p>
        </Item>
        <Item
          data-state={cascade2.state}
          onTransitionEnd={() => cascade2.onTransitionEnd()}
          index={2}
        >
          <Link to="/">Home</Link>
          <p>Some generic description about the about page. About.</p>
        </Item>
        <Item
          data-state={cascade3.state}
          onTransitionEnd={() => cascade3.onTransitionEnd()}
          index={3}
        >
          <Link to="/">Home</Link>
          <p>Some generic description about the about page. About.</p>
        </Item>
        <Item
          data-state={cascade4.state}
          onTransitionEnd={() => cascade4.onTransitionEnd()}
          index={4}
        >
          <Link to="/">Home</Link>
          <p>Some generic description about the about page. About.</p>
        </Item>
      </ul>
    </div>
  );
};
