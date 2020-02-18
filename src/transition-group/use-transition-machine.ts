import { useReducer, useLayoutEffect } from "react";
import { UnionToIntersection } from "./types";

export enum State {
  preEnter = "preEnter",
  enter = "enter",
  idle = "idle",
  exit = "exit",
  exited = "exited"
}

export enum Action {
  ENTER = "ENTER",
  ENTERED = "ENTERED",
  EXIT = "EXIT",
  EXITED = "EXITED"
}

export const machine = {
  initial: State.preEnter,
  states: {
    [State.preEnter]: {
      entry: ["startEnter"],
      on: { [Action.ENTER]: State.enter }
    },
    [State.enter]: {
      entry: ["onEntered"],
      on: { [Action.ENTERED]: State.idle }
    },
    [State.idle]: {
      on: { [Action.EXIT]: State.exit }
    },
    [State.exit]: {
      on: { [Action.EXITED]: State.exited }
    },
    [State.exited]: {
      type: "final",
      entry: ["onExited"]
    }
  }
};

export const reducer = (state: State, action: Action): State => {
  const current = machine.states[state];
  if ("on" in current) {
    return (
      (current.on as UnionToIntersection<typeof current.on>)[action] || state
    );
  }
  return state;
};

type TransitionMachine<T> = (args?: T) => [State, React.Dispatch<Action>];
type EffectsMap = Record<string, VoidFunction>;

const useTransitionMachine: TransitionMachine<EffectsMap> = (map = {}) => {
  const [state, send] = useReducer(reducer, machine.initial);
  /**
   * Enter and Exit Effects
   */
  useLayoutEffect(() => {
    const current = machine.states[state];
    if ("entry" in current) {
      (current.entry || []).map(effect => map[effect]?.());
    }
    // return () => {
    //   if ("exit" in current) {
    //     (current.exit || []).map(effect => map[effect]?.());
    //   }
    // };
  }, [state]); //eslint-disable-line

  return [state, send];
};

export default useTransitionMachine;
