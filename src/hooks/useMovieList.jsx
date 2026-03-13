import React, { useState, useRef, useEffect } from 'react';
import axiosConfig from '../services/tmdbApiConfig.jsx'

export default function useMovieList() {

    const [movieList, setMovieList] = useState([]);
    const [movieListType, setMovieListType] = useState("recent");
    const isMovieListLoading = useRef(false);

    const isLastPage = useRef(false);
    const page = useRef(1);
    const currentSearchString = useRef("");

    useEffect(() => {
        loadRecentMovies();
    }, [])

    async function loadRecentMovies() {
        isMovieListLoading.current = true;
        isLastPage.current = false;
        page.current = 1;
        try {
            const result = await getRecentMovies(1);
            setMovieList(result);
            setMovieListType("recent");
        }
        catch(e) {
            console.error(e);
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function incrementPagesOfRecentMovies() {
        if(isLastPage.current) return;
        isMovieListLoading.current = true;
        try {
            const result = await getRecentMovies(page.current + 1);
            if(result === null) return;
            if(result.length === 0) {
                isLastPage.current = true;
                return;
            }
            setMovieList(prev => [...prev, ...result]);
            page.current += 1;
        }
        catch(e) {
            console.error(e);
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function loadSearchedMovies(searchString) {
        isMovieListLoading.current = true;
        isLastPage.current = false;
        currentSearchString.current = searchString;
        page.current = 1;
        try {
            const result = await getSearchedMovies(searchString, 1);
            setMovieList(result);
            setMovieListType("search");
        }
        catch(e) {
            console.error(e);
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function incrementPagesOfSearchedMovies() {
        if(isLastPage.current) return;
        isMovieListLoading.current = true;
        try {
            const result = await getSearchedMovies(currentSearchString.current, page.current + 1);
            if(result === null) return;
            if(result.length === 0) {
                isLastPage.current = true;
                return;
            }
            setMovieList(prev => [...prev, ...result]);
            page.current += 1;
        }
        catch(e) {
            console.error(e);
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    function loadFavoriteMovies(favoriteList) {
        setMovieList(favoriteList);
        setMovieListType("favorite");
    }

    
    return { 
        movieList,
        movieListType,
        isMovieListLoading,
        loadRecentMovies,
        incrementPagesOfRecentMovies,
        loadSearchedMovies,
        incrementPagesOfSearchedMovies,
        loadFavoriteMovies
    }
    
}

async function getRecentMovies(page) {
    try {

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];   // toISOString() returns "YYYY-MM-DDTHH:mm:ss.sssZ"

        const response = await axiosConfig.get('/discover/movie', {
            params: {
                "page": page,
                "sort_by": "primary_release_date.desc",
                "primary_release_date.lte": formattedDate,
                "release_date.lte": formattedDate,
                "region": "US",
                "vote_count.gte": 10
            }
        });
        
        return response.data.results;
    }
    catch(e) {
        console.error(e);
        return null;
    }
}

async function getSearchedMovies(searchString, page) {
    try {

        if(!searchString) {
            throw new Error("Empty or Invalid search word!");
        }

        const response = await axiosConfig.get('/search/movie', {
            params: {
                "query": searchString,
                "page": page,
                "region": "US"
            }
        });

        return response.data.results;
    }
    catch(e) {
        console.error(e);
        return null;
    }
}