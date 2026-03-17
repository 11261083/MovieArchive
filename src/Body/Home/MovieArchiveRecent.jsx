import { useEffect, useRef, useState } from 'react';
import HomeCardsGrid from './HomeCardsGrid';

export default function MovieArchiveRecent({ loadRecentMovies, incrementPagesOfRecentMovies, isMovieListLoading }) { 

    const [recentMovieList, setRecentMovieList] = useState([]);

    const delimiterRef = useRef(null);

    useEffect(() => {
        loadRecentMovies()
            .then(result => setRecentMovieList(result))
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
                incrementPagesOfRecentMovies()
                    .then(result => {
                        if(result && result.length > 0) {
                            setRecentMovieList(prev => [...prev, ...result]);
                        }
                    })
                    .catch(e => console.error(e));
            }
        }, options);
        observer.observe(delimiterRef.current);

        return(() => {
            observer.disconnect();
        });
    }, []);

    return(
        <>
            <HomeCardsGrid movieList={recentMovieList} />
            <div className='screen-delimiter' ref={delimiterRef}></div>
        </>
    );
}
