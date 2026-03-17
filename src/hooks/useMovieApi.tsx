import { useRef } from 'react';
import axiosConfig from '../services/tmdbApiConfig';

export default function useMovieApi() {

    const isMovieListLoading = useRef(false);

    const isLastPage = useRef(false);
    const page = useRef(1);

    async function loadRecentMovies() {
        isMovieListLoading.current = true;
        isLastPage.current = false;
        page.current = 1;
        try {
            const result = await getRecentMovies(1);
            return result;
        }
        catch(e) {
            console.error(e);
            return [];
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
                return [];
            }
            page.current += 1;
            return result;
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function loadSearchedMovies(searchString) {
        if(!searchString) throw new Error("Empty or Invalid search string!");
        isMovieListLoading.current = true;
        isLastPage.current = false;
        page.current = 1;
        try {
            const result = await getSearchedMovies(searchString, 1);
            return result;
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function incrementPagesOfSearchedMovies(searchString) {
        if(isLastPage.current) return;
        isMovieListLoading.current = true;
        try {
            const result = await getSearchedMovies(searchString, page.current + 1);
            if(result === null) return;
            if(result.length === 0) {
                isLastPage.current = true;
                return;
            }
            page.current += 1;
            return result;
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function loadMovieDetail(movieId) {
        try {
            const result = await getMovieDetailById(movieId);
            return result;
        }
        catch(e) {
            console.error(e);
        }
    }

    return { 
        isMovieListLoading,
        loadRecentMovies,
        incrementPagesOfRecentMovies,
        loadSearchedMovies,
        incrementPagesOfSearchedMovies,
        loadMovieDetail
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