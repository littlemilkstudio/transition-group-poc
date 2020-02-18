import { useReducer, useLayoutEffect } from "react";
import { UnionToIntersection } from "./types";

export const machine = {
  initial: "preEnter",
  states: {
    preEnter: {
      entry: ["startEnter"],
      on: { ENTER: "enter" }
    },
    enter: {
      on: { ENTERED: "idle" }
    },
    idle: {
      on: { EXIT: "exit" }
    },
    exit: {
      on: { EXITED: "exited" }
    },
    exited: {
      type: "final"
    }
  }
};

type WithAction<T> = Extract<T, { on: {} }>;
type KeysFromUnion<T> = keyof UnionToIntersection<T>;

export type Machine = typeof machine;
export type States = Machine["states"];
export type State = keyof States;
export type Actions = WithAction<States[State]>["on"];
export type Action = KeysFromUnion<Actions>;

export const reducer = (state: State, action: Action) => {
  return machine.states[state]?.on[action] || state;
};

type TransitionMachine<T> = (args?: T) => [State, React.Dispatch<Action>];

type TransitionMachineArgs = {
  onEntered?: VoidFunction;
  onExited?: VoidFunction;
};

const useTransitionMachine: TransitionMachine<TransitionMachineArgs> = args => {
  const [state, send] = useReducer(reducer, machine.initial);

  /**
   * case <state>:
   *  entry();
   *  return () => { exit() };
   */
  useLayoutEffect(() => {
    switch (state) {
      case "entered":
        args?.onEntered?.();
        return;
      case "exited":
        args?.onExited?.();
        return;
      default:
        return;
    }
  }, [state]); //eslint-disable-line

  return [state, send];
};

export default useTransitionMachine;
