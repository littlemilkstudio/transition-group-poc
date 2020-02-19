import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useCallback
} from "react";
import useTransitionMachine, {
  State,
  Action,
  requestNextAnimationFrame
} from "./use-transition-machine";
import useUniqueId from "./use-unique-id";
import useChildrenToKeyMap from "./use-children-to-key-map";

type CascadeProps = {
  // children: React.ReactNode;
};
export const Cascade: React.FC<CascadeProps> = props => {
  const keyMap = useChildrenToKeyMap(props.children);
  const [state, setState] = useState<
    Record<
      string,
      {
        state: State;
        node: React.ReactElement;
      }
    >
  >({});

  useEffect(() => {
    console.log("state", state);
    console.log("keyMap", keyMap);
  }, [keyMap, state]);

  const removeFromState = (key: string) => {
    setState(state => {
      delete state[key];
      console.log(`key ${key} removed from state`, state[key]);
      return { ...state };
    });
  };

  useEffect(() => {
    // new entry doesn't exist in state
    Object.keys(keyMap).forEach(key => {
      if (!state[key]) {
        setState(state => ({
          ...state,
          [key]: { node: keyMap[key], state: State.enter }
        }));
      }
    });

    // keyMap doesn't have an old entry
    Object.keys(state).forEach(key => {
      if (!keyMap[key] && state[key].state === State.enter) {
        setState(state => {
          state[key].state = State.exit;
          return { ...state };
        });
      }
    });
  }, [keyMap, state]);

  /**
   * todo: enter and remove children
   * todo: leverage useCascade if this child of another CascadeProvider
   */
  return (
    <>
      {Object.entries(state).map(([key, child]) => (
        <CascadeProvider
          key={key}
          state={child.state}
          onEntered={() => {
            // probably just a callback for props
            console.log(key, "onEntered");
          }}
          onExited={() => {
            console.log(key, "onExited");
            removeFromState(key);
          }}
        >
          {child.node as React.ReactElement}
        </CascadeProvider>
      ))}
    </>
  );
};

type WithState = {
  state: State;
};

type CascadeCtx = {
  set: (id: string, state: State) => void;
  unsubscribe: (id: string) => void;
} & WithState;

const cascadeCtx = React.createContext<CascadeCtx>({
  state: State.preEnter,
  set: (id: string, state: State) => {},
  unsubscribe: (id: string) => {}
});

const completedStateActions: Partial<Record<State, Action>> = {
  [State.idle]: Action.ENTERED,
  [State.exited]: Action.EXITED
};

type Subscriptions = {
  [id: string]: State;
};

type CascadeProviderProps = {
  onEntered: VoidFunction;
  onExited: VoidFunction;
} & WithState;

export const CascadeProvider: React.FC<CascadeProviderProps> = props => {
  const [state, send] = useTransitionMachine({
    onEntered: props.onEntered,
    onExited: props.onExited
  });

  useEffect(() => {
    [State.enter].includes(props.state) &&
      requestNextAnimationFrame(() => send(Action.ENTER));
    [State.exit].includes(props.state) &&
      requestNextAnimationFrame(() => send(Action.EXIT));
  }, [props.state, send]);

  const subscribers = useMemo(() => {
    const subscriptions: Subscriptions = {};
    const syncChildren = () => {
      Object.keys(completedStateActions).forEach(state => {
        if (Object.values(subscriptions).every(current => state === current)) {
          if (completedStateActions[state as State]) {
            console.log(
              "SENDING EXIT",
              subscriptions,
              completedStateActions[state as State]
            );
            send(completedStateActions[state as State] as Action);
          }
        }
      });
    };

    const set = (id: string, state: State) => {
      subscriptions[id] = state;
      syncChildren();
    };

    const remove = (id: string) => {
      // delete subscriptions[id];
      syncChildren();
    };

    const log = () => console.log("subscriptions", subscriptions);

    return {
      set,
      delete: remove,
      log
    };
  }, [send]);

  subscribers.log();

  const unsubscribe = (id: string) => {
    subscribers.delete(id);
  };

  return (
    <cascadeCtx.Provider
      value={{
        state: state,
        set: subscribers.set,
        unsubscribe
      }}
    >
      {props.children}
    </cascadeCtx.Provider>
  );
};

export const useCascadeCtx = () => {
  const { state, set, unsubscribe } = useContext(cascadeCtx);
  const id = useUniqueId();

  useEffect(() => {
    return () => {
      unsubscribe(id);
    };
  }, [id, unsubscribe]);

  const curriedSet = (id: string) => (state: State) => set(id, state);

  return {
    state: state,
    set: curriedSet(id)
  };
};

export const useCascade = () => {
  const cascade = useCascadeCtx();
  const [state, send] = useTransitionMachine({
    onStateEntry: () => {
      console.log("hook level state change", state);
      cascade.set(state);
    }
  });

  useEffect(() => {
    [State.enter].includes(cascade.state) &&
      requestNextAnimationFrame(() => send(Action.ENTER));
    [State.exit].includes(cascade.state) &&
      requestNextAnimationFrame(() => send(Action.EXIT));
  }, [cascade.state, send]);

  const onTransitionEnd = useCallback(() => {
    [State.enter].includes(state) && send(Action.ENTERED);
    [State.exit].includes(state) && send(Action.EXITED);
  }, [send, state]);

  return {
    state,
    onTransitionEnd
  };
};

export default Cascade;
export { State } from "./use-transition-machine";

/**
 * Possible Names:
 *  - Cascade
 *  - Crescendo
 *  - Domino
 */
