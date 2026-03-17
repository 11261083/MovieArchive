import { useEffect, useRef, useState } from 'react';
import HomeCardsGrid from './HomeCardsGrid';
import { useSearchParams } from 'react-router';

export default function MovieArchiveSearch({ loadSearchedMovies, incrementPagesOfSearchedMovies, isMovieListLoading }) {

    const [searchParams] = useSearchParams();
    const searchString = searchParams.get('q');

    const [searchedMovieList, setSearchedMovieList] = useState([]);

    const delimiterRef = useRef(null);

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
            if(entries[0].isIntersecting) {
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
        observer.observe(delimiterRef.current);

        return(() => {
            observer.disconnect();
        });
    }, [searchString]);

    return(
        <>
            <HomeCardsGrid movieList={searchedMovieList} />
            <div className='screen-delimiter' ref={delimiterRef}></div>
        </>
    );
}