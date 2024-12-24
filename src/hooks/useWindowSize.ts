import { useDeferredValue, useEffect, useState } from "react";

export function useWindowSize() {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const deferredInnerWidth = useDeferredValue(innerWidth);

  useEffect(() => {
    const callback = () => setInnerWidth(window.innerWidth);
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  return deferredInnerWidth;
}
