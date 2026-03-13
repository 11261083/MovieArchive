import './MovieArchiveBody.css';
import Home from './Home/MovieArchiveHome.jsx';
import Detail from './Detail/MovieDetail.jsx';
import Login from './Login/MovieArchiveLogin.jsx';
import axiosConfig from '../services/tmdbApiConfig.jsx'

import React, { useState, useEffect } from 'react';

export default function MovieArchiveBody({ bodyPageHash, bodyPageNavigate }) {

    const [selectedMovieDetail, setSelectedMovieDetail] = useState(null);

    const [bodyPage, bodyPageParam] = bodyPageHash.split("?");

    useEffect(() => {
        async function handleMovieDetailLoad(movieId) {
            try {
                const result = await getMovieDetailById(movieId);
                setSelectedMovieDetail(result);
            }
            catch(e) {
                console.error(e);
            }
        }

        if(bodyPage === "#detail") {
            handleMovieDetailLoad(bodyPageParam);
        }
    }, [bodyPageHash]);

    function handleMovieCardClick(movieId) {
        bodyPageNavigate(`detail?${movieId}`);
    }

    function bodyPageRender() {

        switch(bodyPage) {
            case "#home": 
                return <Home handleMovieCardClick={handleMovieCardClick} />;
            case "#detail":
                return <Detail selectedMovieDetail={selectedMovieDetail} bodyPageNavigate={bodyPageNavigate} />;
            case "#login":
                return <Login />;
            default: 
                return <Home handleMovieCardClick={handleMovieCardClick} />;
        }
    }

    return(
        <div className='body-container'>
            { bodyPageRender() }
        </div>
    );
}

async function getMovieDetailById(movieId) {
    try {

        if(!movieId) {
            throw new Error("No valid Id was found!");
        }

        const response = await axiosConfig.get(`/movie/${movieId}`);

        return response.data;
    }
    catch(e) {
        console.error(e);
        //alert(e);
        return null;
    }
}