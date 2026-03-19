import './MovieArchiveHome.css';

import { useEffect, useRef, useState, type RefObject } from 'react';
import HomeCardsGrid from './HomeCardsGrid';
import type { IMovie } from '../../model/model';

export default function MovieArchiveRecent({ 
    loadRecentMovies,
    incrementPagesOfRecentMovies,
    isMovieListLoading,
}: {
    loadRecentMovies: () => Promise<IMovie[]>,
    incrementPagesOfRecentMovies: () => Promise<IMovie[]>,
    isMovieListLoading: RefObject<boolean>
}) { 

    const [recentMovieList, setRecentMovieList] = useState<IMovie[]>([]);

    const delimiterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadRecentMovies()
            .then((result: IMovie[]) => setRecentMovieList(result))
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
                incrementPagesOfRecentMovies()
                    .then((result: IMovie[]) => {
                        if(result && result.length > 0) {
                            setRecentMovieList((prev) => [...prev, ...result]);
                        }
                    })
                    .catch(e => console.error(e));
            }
        }, options);
        if(delimiterRef.current) observer.observe(delimiterRef.current);

        return(() => {
            observer.disconnect();
        });
    }, []);

    return(
        <div className="home-container">
            <div className='home-list-title'>Recent Movies</div>
            <HomeCardsGrid movieList={recentMovieList} />
            <div className='screen-delimiter' ref={delimiterRef}></div>
        </div>
    );
}
