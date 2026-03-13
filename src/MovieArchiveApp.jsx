import './MovieArchiveApp.css';
import Header from './Header/MovieArchiveHeader.jsx';
import Body from './Body/MovieArchiveBody.jsx';
import Footer from './Footer/MovieArchiveFooter.jsx';

import React, { useState, useEffect, createContext } from 'react';
import useUserAuth from './hooks/useUserAuth.jsx';
import useMovieList from './hooks/useMovieList.jsx';

export const StateContext = createContext();

export default function MovieArchiveApp() {

    const { 
        userInfo, 
        userLogin, 
        userLogout, 
        userRegister, 
        userAddFavoriteMovieToList, 
        userRemoveFavoriteMovieFromList, 
        userDeleteAccount 
    } = useUserAuth();

    const { 
        movieList,
        movieListType,
        isMovieListLoading, 
        loadRecentMovies, 
        incrementPagesOfRecentMovies, 
        loadSearchedMovies, 
        incrementPagesOfSearchedMovies, 
        loadFavoriteMovies 
    } = useMovieList();

    const [bodyPageHash, setBodyPageHash] = useState(window.location.hash);

    useEffect(() => {
        function handleHashChange() {
            setBodyPageHash(window.location.hash);
        };

        window.addEventListener("hashchange", handleHashChange);

        return (() => {
            window.removeEventListener("hashchange", handleHashChange);
        });
    }, []);

    useEffect(() => {
        const [page, param] = bodyPageHash.split("?");

        if(page === "#home") {

            if(param === "favorite") {
                userInfo ? loadFavoriteMovies(userInfo.favoriteMoviesList) : bodyPageNavigate("home")
            }
            else if(param && param.startsWith("search")) {
                const searchString = param.split("=")[1];
                loadSearchedMovies(searchString);
            }
            else loadRecentMovies();
        }

    }, [bodyPageHash]);

    function bodyPageNavigate(page) {
        window.location.hash = page;
    }

    return(
        <div className='movie-archive-app-container'>
            <div className='movie-archive-app-box'>
                <StateContext.Provider value={
                    {
                        userInfoProvider: userInfo,
                        userLoginProvider: userLogin,
                        userLogoutProvider: userLogout,
                        userRegisterProvider: userRegister,
                        userAddFavoriteMovieToListProvider: userAddFavoriteMovieToList,
                        userRemoveFavoriteMovieFromListProvider: userRemoveFavoriteMovieFromList,
                        userDeleteAccountProvider: userDeleteAccount,
                        movieListProvider: movieList,
                        movieListTypeProvider: movieListType,
                        incrementPagesOfRecentMoviesProvider: incrementPagesOfRecentMovies,
                        incrementPagesOfSearchedMoviesProvider: incrementPagesOfSearchedMovies,
                        isMovieListLoadingProvider: isMovieListLoading
                    }
                }>
                    <Header 
                        bodyPageNavigate={bodyPageNavigate} 
                    />
                    <Body 
                        bodyPageHash={bodyPageHash} 
                        bodyPageNavigate={bodyPageNavigate}
                    />
                    <Footer/>
                </StateContext.Provider>
            </div>
        </div>
    );
}