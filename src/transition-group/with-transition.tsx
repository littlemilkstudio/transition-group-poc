import React from "react";
import { useCascade } from "./";

const withTransition = (
  Component: React.FC<Record<string, any>>
): React.FC<Record<string, any>> => {
  return props => {
    const cascade = useCascade();
    return (
      <Component
        data-state={cascade.state}
        onTransitionEnd={cascade.onTransitionEnd}
        {...props}
      />
    );
  };
};

export default withTransition;
