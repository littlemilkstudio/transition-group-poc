import React, { useMemo } from "react";

type ChildWithKey = React.ReactElement<{
  key: string;
}>;

function childHasKey(child: React.ReactNode): child is ChildWithKey {
  return React.isValidElement<ChildWithKey>(child);
}

function useChildrenToKeyMap(children: React.ReactNode) {
  return useMemo(() => {
    const keyMap: Record<string, ChildWithKey> = {};
    React.Children.forEach(children, child => {
      if (childHasKey(child)) {
        keyMap[String(child.key)] = child as ChildWithKey;
      }
    });

    return keyMap;
  }, [children]);
}

export default useChildrenToKeyMap;
