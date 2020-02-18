import React, { useContext, useEffect } from "react";
import useTransitionMachine, { State } from "./use-transition-machine";
import useUniqueId from "./use-unique-id";

type WithState = {
  state: State;
};

export const Cascade: React.FC = props => {
  /**
   * todo: Create key to child map
   * todo: add and remove children
   * todo: leverage useCascade if this child of another CascadeProvider
   */
  return <>{props.children}</>;
};

type CascadeCtx = {
  onEntered: (id: string) => void;
  onExited: (id: string) => void;
} & WithState;

const cascadeCtx = React.createContext<CascadeCtx>({
  state: "preEnter",
  onEntered: (id: string) => {},
  onExited: (id: string) => {}
});

type CascadeProviderProps = {
  onEntered: VoidFunction;
  onExited: VoidFunction;
} & WithState;

export const CascadeProvider: React.FC<CascadeProviderProps> = props => {
  const [state, send] = useTransitionMachine({
    onEntered: props.onEntered,
    onExited: props.onExited
  });

  return (
    <cascadeCtx.Provider
      value={{
        state: state,
        onEntered: id => {
          /**
           * todo: Update child to entered
           * todo: Check if all children have entered
           */
          if (false) {
            send("ENTERED");
          }
        },
        onExited: id => {
          /**
           * todo: Update child to exited
           * todo: Check if all children have exited
           */
          if (false) {
            send("EXITED");
          }
        }
        /**
         * todo: initializeSubscription: id => {...}
         * todo: removeSubscription: id => {...}
         */
      }}
    >
      {props.children}
    </cascadeCtx.Provider>
  );
};

export const useCascadeCtx = () => {
  const { state, onEntered, onExited } = useContext(cascadeCtx);

  const id = useUniqueId();
  /**
   * useEffect(() => {
   *  cascade.subscribe(id);
   *  return () => { cascade.unsubscribe(id) }
   * }, [])
   */

  return {
    state,
    onEntered: () => onEntered(id),
    onExited: () => onExited(id)
  };
};

export const useCascade = () => {
  const cascade = useCascadeCtx();
  const [state, send] = useTransitionMachine({
    onEntered: cascade.onEntered,
    onExited: cascade.onExited
  });

  useEffect(() => {
    switch (cascade.state) {
      case "enter":
        send("ENTER");
        return;
      case "exit":
        send("EXIT");
        return;
      default:
        return;
    }
  }, [cascade.state, send]);

  return {
    state,
    onTransitionEnd: () => {
      send("ENTERED");
      send("EXITED");
    }
  };
};

export default Cascade;

/**
 * Possible Names:
 *  - Cascade
 *  - Crescendo
 *  - Domino
 */
