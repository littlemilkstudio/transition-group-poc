import { useMemo } from "react";

let id = 0;
const useUniqueId = () => {
  return useMemo(() => `${++id}`, []);
};

export default useUniqueId;
