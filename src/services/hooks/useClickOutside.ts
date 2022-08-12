import { RefObject, useEffect } from "react";

/**
 * Handles click outside scenario
 * 
 * @param ref - ref of the object
 * @param handler - what happens when we click outside of the given object
 */
const useClickOutside = (ref: RefObject<HTMLDivElement>, handler: Function) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: any) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event: any) => {
      startedWhenMounted = ref.current ? true : false;
      startedInside =
        ref.current && ref.current.contains(event.target) ? true : false;
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
