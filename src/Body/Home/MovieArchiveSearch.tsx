import './MovieArchiveHome.css';

import { useEffect, useRef, useState, type RefObject } from 'react';
import HomeCardsGrid from './HomeCardsGrid';
import { useSearchParams } from 'react-router';
import type { IMovie } from '../../model/model';

export default function MovieArchiveSearch({ 
    loadSearchedMovies, 
    incrementPagesOfSearchedMovies, 
    isMovieListLoading 
}: {
    loadSearchedMovies: (searchString: string) => Promise<IMovie[]>, 
    incrementPagesOfSearchedMovies: (searchString: string) => Promise<IMovie[]>, 
    isMovieListLoading: RefObject<boolean>
}) {

    const [searchParams] = useSearchParams();
    const searchString: string = searchParams.get('q') ?? "";

    const [searchedMovieList, setSearchedMovieList] = useState<IMovie[]>([]);

    const delimiterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadSearchedMovies(searchString)
            .then(result => setSearchedMovieList(result))
            .catch(e => {console.error(e);});

        const options = {
            root: document.querySelector("#scrollArea"),
            rootMargin: "0px",
            scrollMargin: "0px 0px 200px 0px",
            threshold: 1.0,
        };

        const observer = new IntersectionObserver((entries) => {
            if(entries[0] ? entries[0].isIntersecting : false) {
                if(isMovieListLoading.current) return;
                incrementPagesOfSearchedMovies(searchString)
                    .then(result => {
                        if(result && result.length > 0) {
                            setSearchedMovieList(prev => [...prev, ...result]);
                        }
                    })
                    .catch(e => console.error(e));
            }
        }, options);
        if(delimiterRef.current) observer.observe(delimiterRef.current);

        return(() => {
            observer.disconnect();
        });
    }, [searchString]);

    return(
        <div className="home-container">
            <div className='home-list-title'>Search Movies</div>
            <HomeCardsGrid movieList={searchedMovieList} />
            <div className='screen-delimiter' ref={delimiterRef}></div>
        </div>
    );
}