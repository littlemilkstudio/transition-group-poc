import React from "react";
import styled from "styled-components";
import Cascade, { State, useCascade } from "./transition-group";
import Home from "./Home";
import About from './About';
import { useLocation, Switch, Route, Link } from "react-router-dom";
import "./App.css";

const SiteContainer = styled.div`
  background: white;
  padding: 20px;
  min-height: calc(100vh - 20px);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const SiteNav = styled.ul`
  list-style: none;
  flex: 0 0 120px;

  li {
    margin-bottom: 10px;
  }
`;

const Container = styled.div`
  transition: opacity 0.3s ease;
  opacity: 0;

  &[data-state=${State.enter}], 
  &[data-state=${State.idle}] {
    opacity: 1;
    transition-delay: .3s;
  }

  &[data-state=${State.exit}], 
  &[data-state=${State.preEnter}], 
  &[data-state=${State.exited}] {
    opacity:0;
  }

  &[data-state=${State.exit}],
  &[data-state=${State.exited}] {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
  }
`;

const RouteContainer: React.FC = props => {
  const cascade = useCascade();
  console.log(cascade.state);
  return (
    <Container
      data-state={cascade.state}
      onTransitionEnd={() => cascade.onTransitionEnd()}
    >
      {props.children}
    </Container>
  );
};

const Content = styled.div`
  position: relative;
`;

const App: React.FC = () => {
  const location = useLocation();

  return (
    <SiteContainer>
      <header>
        <h1>Route transitions with Pose and React Router</h1>
      </header>
      <ContentContainer>
        <SiteNav>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </SiteNav>
        <Content>
          <Cascade>
            <RouteContainer key={location.pathname}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
              </Switch>
            </RouteContainer>
          </Cascade>
        </Content>
      </ContentContainer>
    </SiteContainer>
  );
};

export default App;
