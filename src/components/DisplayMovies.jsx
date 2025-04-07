import React, { useEffect, useState } from "react";
import SectionHeadTitle from "./SectionHeadTitle";

const DisplayMovies = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const HEADER = import.meta.env.VITE_API_Header;
  const BASE_URL = "https://api.themoviedb.org/3";

  const [movieGenreList, setMovieGenreList] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [error, setError] = useState(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${HEADER}`,
    },
  };

  const fetchAll = async () => {
    setisloading(true);
    setError("");
    try {
      const endpoint = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error("Something went wrong, please try again.");
      }

      const data = await response.json();
      setMovieGenreList(data.genres); // Set genres

      // Fetch movies for each genre (you can parallelize requests using Promise.all)
      const genreMoviesPromises = data.genres.map(async (genre) => {
        const genreMoviesEndpoint = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&language=en-US`;
        const genreMoviesResponse = await fetch(genreMoviesEndpoint, options);

        if (!genreMoviesResponse.ok) {
          throw new Error(`Error fetching movies for genre ${genre.name}`);
        }

        const genreMoviesData = await genreMoviesResponse.json();

        return { genre: genre.name, movies: genreMoviesData.results };
      });

      // Wait for all genre movie requests to complete
      const genreMovies = await Promise.all(genreMoviesPromises);
      setMoviesByGenre(genreMovies); // Set movies by genre
    } catch (error) {
      setError(error.message);
      console.log("Error fetching", error);
    } finally {
        setisloading(false)
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="mt-20 w-screen py-4">
      <div className="max-container">
        <SectionHeadTitle
          title="Explore our wide variety of categories"
          description="Whether you're looking for a comedy to make you laugh, a drama to make you think, or a documentary to learn something new"
        />
        {isloading ? (
          <span class="loader ml-5 my-5"></span>
        ) : error ? (
          <p className="text-red-10 font-semibold text-center">{error}</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-1">
            {moviesByGenre.map((list, index) => (
              <div className="p-3 size-full bg-black-50 rounded-sm" key={index}>
                <div className="size-full grid grid-cols-2 gap-1">
                  {list.movies.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      className="object-contain object-center cursor-pointer"
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                          : "/img/error.jpg"
                      }
                      alt={list.original_title}
                    />
                  ))}
                </div>

                <p className="text-white whitespace-nowrap text-base font-semibold cursor-pointer -translate-y-1">
                  {list.genre}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayMovies;
