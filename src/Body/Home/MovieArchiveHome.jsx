import './MovieArchiveHome.css';

import React, { useEffect, useContext } from 'react';
import { Outlet } from 'react-router';
import { StateContext } from '../../MovieArchiveApp';

export default function MovieArchiveHome({ handleMovieCardClick }) {

    const movieList = useContext(StateContext).movieListProvider;
    const movieListType = useContext(StateContext).movieListTypeProvider;
    const incrementPagesOfRecentMovies = useContext(StateContext).incrementPagesOfRecentMoviesProvider;
    const incrementPagesOfSearchedMovies = useContext(StateContext).incrementPagesOfSearchedMoviesProvider;
    const isMovieListLoading = useContext(StateContext).isMovieListLoadingProvider;

    // useEffect(() => {
    //     function handleScroll() {
    //         if(isMovieListLoading.current) return;

    //         if(window.scrollY + window.innerHeight > document.body.scrollHeight - 300) {
    //             if(movieListType === "recent") {
    //                 incrementPagesOfRecentMovies();
    //             }
    //             else if(movieListType === "search") {
    //                 incrementPagesOfSearchedMovies();
    //             }
    //         }
    //     }

    //     window.addEventListener("scroll", handleScroll);

    //     return (() => {
    //         window.removeEventListener("scroll", handleScroll);
    //     });
    // }, [movieList]);

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
            <Outlet />
        </div>
    );
}