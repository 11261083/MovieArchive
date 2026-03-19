import { useRef } from 'react';

import axios from 'axios';
import axiosConfig from '../services/tmdbApiConfig';
import { mapMovieDtoToMovie, mapMovieDetailDtoToMovieDetail } from '../model/mapper';
import type { IMovie, IMovieDetail } from '../model/model';
import type { IMovieDetailDto, IMovieDto } from '../model/DTO';

export default function useMovieApi() {

    const isMovieListLoading = useRef<boolean>(false);

    const isLastPage = useRef<boolean>(false);
    const page = useRef<number>(1);

    async function loadRecentMovies(): Promise<IMovie[]> {
        isMovieListLoading.current = true;
        isLastPage.current = false;
        page.current = 1;
        try {
            const result: IMovieDto[] = await getRecentMovies(1) ?? [];
            return result.map((dto: IMovieDto) => mapMovieDtoToMovie(dto));
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function incrementPagesOfRecentMovies(): Promise<IMovie[]> {
        if(isLastPage.current) return [];
        isMovieListLoading.current = true;
        try {
            const result: IMovieDto[] | null = await getRecentMovies(page.current + 1);
            if(result === null) return [];
            if(result.length === 0) {
                isLastPage.current = true;
                return [];
            }
            page.current += 1;
            return result.map((dto: IMovieDto) => mapMovieDtoToMovie(dto));
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function loadSearchedMovies(searchString: string): Promise<IMovie[]> {
        if(!searchString.trim()) throw new Error("Empty or Invalid search string!");
        isMovieListLoading.current = true;
        isLastPage.current = false;
        page.current = 1;
        try {
            const result: IMovieDto[] = await getSearchedMovies(searchString, 1) ?? [];
            return result.map((dto: IMovieDto) => mapMovieDtoToMovie(dto));
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function incrementPagesOfSearchedMovies(searchString: string): Promise<IMovie[]> {
        if(isLastPage.current) return [];
        isMovieListLoading.current = true;
        try {
            const result: IMovieDto[] | null = await getSearchedMovies(searchString, page.current + 1);
            if(result === null) return [];
            if(result.length === 0) {
                isLastPage.current = true;
                return [];
            }
            page.current += 1;
            return result.map((dto: IMovieDto) => mapMovieDtoToMovie(dto));
        }
        catch(e) {
            console.error(e);
            return [];
        }
        finally {
            isMovieListLoading.current = false;
        }
    }

    async function loadMovieDetail(movieId: number): Promise<IMovieDetail | null> {
        try {
            const result: IMovieDetailDto | null = await getMovieDetailById(movieId);
            if(!result) return null;
            return mapMovieDetailDtoToMovieDetail(result);
        }
        catch(e) {
            console.error(e);
            return null;
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

async function getRecentMovies(page: number): Promise<IMovieDto[] | null> {
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
        if(axios.isAxiosError(e)) {
            console.error(e.response?.status, e.response?.data.status_message);
        }
        return null;
    }
}

async function getSearchedMovies(searchString: string, page: number): Promise<IMovieDto[] | null> {
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
        if(axios.isAxiosError(e)) {
            console.error(e.response?.status, e.response?.data.status_message);
        }
        return null;
    }
}

async function getMovieDetailById(movieId: number): Promise<IMovieDetailDto | null> {
    try {
        if(!movieId) {
            throw new Error("No valid Id was found!");
        }

        const response = await axiosConfig.get(`/movie/${movieId}`);

        return response.data;
    }
    catch(e) {
        console.error(e);
        if(axios.isAxiosError(e)) {
            console.error(e.response?.status, e.response?.data.status_message);
        }
        return null;
    }
}