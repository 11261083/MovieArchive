import Detail from './Body/Detail/MovieDetail';
import Recent from './Body/Home/MovieArchiveRecent';
import Search from './Body/Home/MovieArchiveSearch';
import Favorite from './Body/Home/MovieArchiveFavorite';
import Login from './Body/Login/MovieArchiveLogin';
import Footer from './Footer/MovieArchiveFooter';
import Header from './Header/MovieArchiveHeader';
import './MovieArchiveApp.css';

import React, { createContext } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import useMovieApi from './hooks/useMovieApi';
import useUserAuth from './hooks/useUserAuth';
import type { IUser } from './model/model';

type ContextType = {
    userInfoProvider: IUser | null
}
export const StateContext = createContext<ContextType | null>(null);

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
        isMovieListLoading, 
        loadRecentMovies, 
        incrementPagesOfRecentMovies, 
        loadSearchedMovies, 
        incrementPagesOfSearchedMovies,
        loadMovieDetail
    } = useMovieApi();

    return(
        <div className='movie-archive-app-container'>
            <div className='movie-archive-app-box'>
                <StateContext.Provider value={{ userInfoProvider: userInfo }}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/home/recent" />} />
                        <Route path="/home">
                            <Route path="recent" element={<Recent 
                                loadRecentMovies={loadRecentMovies} 
                                incrementPagesOfRecentMovies={incrementPagesOfRecentMovies} 
                                isMovieListLoading={isMovieListLoading} />} 
                            />
                            <Route path="search" element={<Search 
                                loadSearchedMovies={loadSearchedMovies} 
                                incrementPagesOfSearchedMovies={incrementPagesOfSearchedMovies} 
                                isMovieListLoading={isMovieListLoading}/>} 
                            />
                            <Route path="favorite" element={<Favorite />} />
                        </Route>
                        <Route path="/login" element={<Login 
                            userLogin={userLogin} 
                            userLogout={userLogout} 
                            userRegister={userRegister}
                            userDeleteAccount={userDeleteAccount} />}
                        />
                        <Route path="/detail/:movieId" element={<Detail 
                            loadMovieDetail={loadMovieDetail} 
                            userAddFavoriteMovieToList={userAddFavoriteMovieToList} 
                            userRemoveFavoriteMovieFromList={userRemoveFavoriteMovieFromList} />} 
                        />
                    </Routes>
                    <Footer />
                </StateContext.Provider>
            </div>
        </div>
    );
}