import { useEffect } from "react";
export function useKey(closemovie) {
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        closemovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [closemovie]);
}
