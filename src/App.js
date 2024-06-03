import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const key = "edbc0f47";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedid, setselectedid] = useState("");

  const { movies, error, isloading } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watchedmovieskey");
  // console.log(watched);
  function handleClick(id) {
    setselectedid((previd) => (previd === id ? "" : id));
  }
  function handleClose() {
    setselectedid("");
  }
  function handleAddMovie(movie, rating, counter) {
    console.log(counter);

    const newMovie = {
      title: movie.Title,
      imdbID: movie.imdbID,
      imdbRating: movie.imdbRating,
      runtime: Number(movie.Runtime.split(" ").at(0)),
      poster: movie.Poster,
      year: movie.Year,
      userRating: rating,
    };
    setWatched((prevmovies) => [...prevmovies, newMovie]);

    handleClose();
  }
  function handleDelete(id) {
    setWatched((prevmovies) =>
      prevmovies.filter((movie) => movie.imdbID !== id)
    );
  }

  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   el.focus();
  // }, []);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isloading && <Loader />}
          {!isloading && !error && (
            <Movielist movies={movies} onSelect={handleClick} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedid ? (
            <MovieDetails
              watched={watched}
              selectedid={selectedid}
              onClose={handleClose}
              onAddMovie={handleAddMovie}
            />
          ) : (
            <>
              <Watchedsummary watched={watched} />
              <WatchedMovies watched={watched} onDelete={handleDelete} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function MovieDetails({ selectedid, onClose, onAddMovie, watched }) {
  const [isloading, setisLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const isWatched = watched.map((movies) => movies.imdbID).includes(selectedid);
  const [rating, setRating] = useState("");
  const numberofclicks = useRef(0);

  useEffect(() => {
    if (rating) numberofclicks.current++;
  }, [rating]);
  // useEffect(() => {
  //   function callback(e) {
  //     if (e.code === "Escape") {
  //       onClose();
  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return function () {
  //     document.removeEventListener("keydown", callback);
  //   };
  // }, [onClose]);
  useKey(onClose);
  useEffect(() => {
    if (!movie.Title) return;
    document.title = movie.Title;
    return () => {
      document.title = "UsePopcorn";
    };
  }, [movie.Title]);

  useEffect(() => {
    async function moviedetails() {
      setisLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${key}&i=${selectedid}`
      );
      const data = await res.json();
      console.log(data);
      // const { Title, Year, Released, Runtime } = data;
      setMovie(data);
      setisLoading(false);
    }
    moviedetails();
  }, [selectedid]);
  return (
    <div className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.Title} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull;{movie.Runtime}
              </p>
              <p>{movie.genre}</p>
              <p>
                <span>🔆</span>
                {movie.imdbRating} Imdb-Rating
              </p>
            </div>
          </header>
          <section>
            {isWatched ? (
              <p>Movie already added to the wishlist</p>
            ) : (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={28}
                  // messages={["Average", "Good", "Ok", "Too Good", "Excellent"]}
                  onSetRating={setRating}
                />

                <button
                  onClick={() => onAddMovie(movie, rating, numberofclicks)}
                  className="btn-add"
                >
                  +Add Movie To Wishlist
                </button>
              </div>
            )}
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed By - {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}
function Loader() {
  return <p className="loader">…. Loading </p>;
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function Search({ query, setQuery }) {
  const inputel = useRef(null);
  // useEffect(() => {
  //   function callback(e) {
  //     if (e.code === "Enter") inputel.current.focus();
  //   }
  //   document.addEventListener("keydown", callback);

  //   return () => document.removeEventListener("keydown", callback);
  // }, []);
  useEffect(() => {
    inputel.current.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputel}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Numresults({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function Movielist({ movies, onSelect }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelect={onSelect} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelect }) {
  return (
    <>
      <li onClick={() => onSelect(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  );
}

function Watchedsummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const averageimdbRating = avgImdbRating.toFixed(1);
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const averageUserRating = avgUserRating.toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const runtimeavg = avgRuntime.toFixed(2);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{averageimdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{averageUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{runtimeavg} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovies({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <>
      <li>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min </span>
          </p>
          <button onClick={() => onDelete(movie.imdbID)} className="btn-delete">
            ❌
          </button>
        </div>
      </li>
    </>
  );
}

//usegeolocation app code from here, useGeolocation.js file comes with this code
//it is ot part of usepopcorn project
// import { useState } from "react";
// import { useGeolocation } from "./useGeolocation";

// export default function App() {
//   const [countClicks, setCountClicks] = useState(0);
//   const { lat, lng, isLoading, error, getPosition } = useGeolocation();

//   // function getPosition() {

//   //   if (!navigator.geolocation)
//   //     return setError("Your browser does not support geolocation");

//   //   setIsLoading(true);
//   //   navigator.geolocation.getCurrentPosition(
//   //     (pos) => {
//   //       setPosition({
//   //         lat: pos.coords.latitude,
//   //         lng: pos.coords.longitude,
//   //       });
//   //       setIsLoading(false);
//   //     },
//   //     (error) => {
//   //       setError(error.message);
//   //       setIsLoading(false);
//   //     }
//   //   );
//   // }
//   function handleClicks() {
//     setCountClicks((count) => count + 1);
//     getPosition();
//   }
//   return (
//     <div>
//       <button onClick={handleClicks} disabled={isLoading}>
//         Get my position
//       </button>

//       {isLoading && <p>Loading position...</p>}
//       {error && <p>{error}</p>}
//       {!isLoading && !error && lat && lng && (
//         <p>
//           Your GPS position:{" "}
//           <a
//             target="_blank"
//             rel="noreferrer"
//             href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
//           >
//             {lat}, {lng}
//           </a>
//         </p>
//       )}

//       <p>You requested position {countClicks} times</p>
//     </div>
//   );
// }
