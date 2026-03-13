import './MovieArchiveHome.css';

import React, { useEffect, useContext } from 'react';
import { StateContext } from '../../MovieArchiveApp';

export default function MovieArchiveHome({ handleMovieCardClick }) {

    const movieList = useContext(StateContext).movieListProvider;
    const movieListType = useContext(StateContext).movieListTypeProvider;
    const incrementPagesOfRecentMovies = useContext(StateContext).incrementPagesOfRecentMoviesProvider;
    const incrementPagesOfSearchedMovies = useContext(StateContext).incrementPagesOfSearchedMoviesProvider;
    const isMovieListLoading = useContext(StateContext).isMovieListLoadingProvider;

    useEffect(() => {
        function handleScroll() {
            if(isMovieListLoading.current) return;

            if(window.scrollY + window.innerHeight > document.body.scrollHeight - 300) {
                if(movieListType === "recent") {
                    incrementPagesOfRecentMovies();
                }
                else if(movieListType === "search") {
                    incrementPagesOfSearchedMovies();
                }
            }
        }

        window.addEventListener("scroll", handleScroll);

        return (() => {
            window.removeEventListener("scroll", handleScroll);
        });
    }, [movieList]);

    function homeTitle() {
        switch(movieListType) {
            case "recent": 
                return "Recent Movies";
            case "search": 
                return "Search Result";
            case "favorite":
                return "Favorite Movies";
        }
    }

    return(
        <div className="home-container">
            <div className='home-list-title'>{homeTitle()}</div>
            <div className='home-cards-grid'>
                {movieList.length > 0 ? movieList.map((movie) => {
                    const movieTitle = movie.title || "Title not found";
                    const releaseYear = movie.release_date.split("-")[0] || "Release date not found";
                    const averageVoteScore = Number(movie.vote_average).toFixed(2);
                    const voteCount = movie.vote_count;
                    return(
                        <MovieCard key={movie.id}
                            moviePosterPath={movie.poster_path}
                            movieTitle={movieTitle}
                            releaseYear={releaseYear}
                            averageVoteScore={averageVoteScore}
                            voteCount={voteCount}
                            movieId={movie.id}
                            handleMovieCardClick={handleMovieCardClick}
                        />
                    )
                }) : "No Movies Found!"}
            </div>
        </div>
    );
}

function MovieCard({ moviePosterPath, movieTitle, releaseYear, averageVoteScore, voteCount, movieId, handleMovieCardClick }) {

    const fallbackPosterImgSrc = "/poster_not_found.png";
    const POSTER_BASE_URL = "https://image.tmdb.org/t/p";
    const POSTER_SIZE = "/w500";

    function handleFallbackPoster(e) {
        e.target.src = fallbackPosterImgSrc;
    }

    return(
        <div onClick={() => handleMovieCardClick(movieId)} className='movie-card'>
            <img src={POSTER_BASE_URL + POSTER_SIZE + moviePosterPath} onError={handleFallbackPoster}/>
            <div className='movie-card-info'>
                <p className='movie-card-title'>{movieTitle}</p>
                <p className='movie-card-subinfo'>{`${releaseYear} • ${averageVoteScore} (${voteCount}) ⭐`}</p>
            </div>
        </div>
    );
}