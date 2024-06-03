import { useState, useEffect } from "react";
const key = "edbc0f47";
export function useMovies(query) {
  const [error, setError] = useState("");
  const [isloading, setisLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setError("");
        setisLoading(true);
        const response = await fetch(
          `  http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        console.log(data.Search);
        if (data.Error === "Movie not found!")
          throw new Error("The movie name u entered is incorrect");
        setMovies(data.Search);
      } catch (err) {
        console.log(err.message);
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setisLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      // setError("");
      return;
    }
    // handleClose();
    fetchData();
    return function () {
      controller.abort();
      console.log("cleanup function executed");
    };
  }, [query]);
  return { movies, isloading, error };
}
