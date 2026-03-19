import { useNavigate } from 'react-router';
import type { IMovie } from '../../model/model';
import type { SyntheticEvent } from 'react';

export default function HomeCardsGrid({ movieList }: {movieList: IMovie[]}) {

    const navigate = useNavigate();

    function handleMovieCardClick(movieId: number): void {
        navigate(`/detail/${movieId}`);
    }

    return(
        <>
            <div className='home-cards-grid'>
                {movieList.length > 0 ? movieList.map((movie: IMovie) => {
                    const movieTitle: string = movie.title || "Title not found";
                    const releaseYear: string = movie.release_date.split("-")[0] || "Release date not found";
                    const averageVoteScore:string = Number(movie.vote_average).toFixed(2);
                    const voteCount: number = movie.vote_count;
                    return(
                        <MovieCard key={movie.id}
                            moviePosterPath={movie.poster_path}
                            movieTitle={movieTitle}
                            releaseYear={releaseYear}
                            averageVoteScore={averageVoteScore}
                            voteCount={voteCount}
                            movieId={movie.id}
                            handleMovieCardClick={handleMovieCardClick}
                        />
                    )
                }) : "No Movies Found!"}
            </div>
        </>
    );
}

function MovieCard({ 
    moviePosterPath, 
    movieTitle, 
    releaseYear, 
    averageVoteScore, 
    voteCount, 
    movieId, 
    handleMovieCardClick 
}: {
    moviePosterPath: string, 
    movieTitle: string, 
    releaseYear: string, 
    averageVoteScore: string, 
    voteCount: number, 
    movieId: number, 
    handleMovieCardClick: (movieId: number) => void 
}) {

    const fallbackPosterImgSrc = "/poster_not_found.png";
    const POSTER_BASE_URL = "https://image.tmdb.org/t/p";
    const POSTER_SIZE = "/w500";

    function handleFallbackPoster(e: SyntheticEvent<HTMLImageElement>) {
        e.currentTarget.src = fallbackPosterImgSrc;
    }

    return(
        <div onClick={() => handleMovieCardClick(movieId)} className='movie-card'>
            <img src={POSTER_BASE_URL + POSTER_SIZE + moviePosterPath} onError={handleFallbackPoster}/>
            <div className='movie-card-info'>
                <p className='movie-card-title'>{movieTitle}</p>
                <p className='movie-card-subinfo'>{`${releaseYear} • ${averageVoteScore} (${voteCount}) ⭐`}</p>
            </div>
        </div>
    );
}