import { useMemo } from "react";

let id = 0;
const useUniqueId = () => {
  return useMemo(() => `${(id += 1)}`, []);
};

export default useUniqueId;
