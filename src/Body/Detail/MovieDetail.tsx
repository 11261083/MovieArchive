import './MovieDetail.css'

import React, { useEffect, useContext, useState, type SyntheticEvent } from 'react';
import { StateContext } from '../../MovieArchiveApp';
import { useNavigate, useParams } from 'react-router';
import type { IMovieDetail, IUser } from '../../model/model';

const fallbackPosterImgSrc: string = "/poster_not_found.png";
const POSTER_BASE_URL: string = "https://image.tmdb.org/t/p";
const POSTER_SIZE: string = "/w500";

export default function MovieDetail({ 
    loadMovieDetail, 
    userAddFavoriteMovieToList, 
    userRemoveFavoriteMovieFromList 
}: {
    loadMovieDetail: (movieId: number) => Promise<IMovieDetail | null>,
    userAddFavoriteMovieToList: (movie: IMovieDetail) => {result: boolean, message: string}, 
    userRemoveFavoriteMovieFromList: (movieId: number) => {result: boolean, message: string}
}) {

    const navigate = useNavigate();
    const { movieId } = useParams();

    const [selectedMovieDetail, setSelectedMovieDetail] = useState<IMovieDetail | null>(null);
    const userInfo: IUser | null = useContext(StateContext)!.userInfoProvider;

    useEffect(() => {
        if(Number(movieId)) {
            loadMovieDetail(Number(movieId))
                .then((result: IMovieDetail | null) => setSelectedMovieDetail(result))
                .catch(e => console.error(e));
        }
    }, []);

    let isFavorite: boolean = false;
    if(selectedMovieDetail) {
        isFavorite = (userInfo ? userInfo.favoriteMoviesList.some(movie => movie.id === selectedMovieDetail.id) : false);
    }

    function handleFallbackPoster(e: SyntheticEvent<HTMLImageElement>): void {
        e.currentTarget.src = fallbackPosterImgSrc;
    }

    function handleFavoriteAdd(): void {
        if(!userInfo) {
            navigate("/login");
            return;
        }

        const {result, message} = userAddFavoriteMovieToList(selectedMovieDetail!);

        if(!result) alert(message);
    }

    function handleFavoriteRemove(): void {
        const {result, message} = userRemoveFavoriteMovieFromList(selectedMovieDetail!.id);

        if(!result) alert(message);
    }

    return(
        <div className="detail-container">
            {selectedMovieDetail ? (
                <div className="movie-detail-info-box">
                    <div className='movie-detail-basic-info'>
                        <div className='poster-box'>
                            <img src={POSTER_BASE_URL + POSTER_SIZE + selectedMovieDetail.poster_path} onError={handleFallbackPoster} />
                        </div>
                        <div className='movie-info-box'>
                            <div className='movie-title-row'>
                                <div className='movie-title'>{selectedMovieDetail.title}</div>
                                <p>{`⭐ ${Number(selectedMovieDetail.vote_average).toFixed(2)} (${selectedMovieDetail.vote_count})`}</p>
                            </div>
                            <div className='movie-tagline'>{selectedMovieDetail.tagline}</div>
                            <div className='movie-genre'>
                                {selectedMovieDetail.genres.join(" • ")}
                            </div>
                            <div className='movie-date-duration'>{`${selectedMovieDetail.release_date} • ${formatMinuteToHourMinute(selectedMovieDetail.runtime)}`}</div>
                            <br/>
                            <div className='movie-summary'>{selectedMovieDetail.overview}</div>
                        </div>
                        <div className='favorite-btn-box'>
                            {isFavorite ? <button onClick={handleFavoriteRemove}><i className="fa-solid fa-bookmark"></i></button> : <button onClick={handleFavoriteAdd}><i className="fa-regular fa-bookmark"></i></button>}
                        </div>
                    </div>
                    <div className='movie-detail-extra-info'>
                        <div className='movie-general-info-container'>
                            <ExtraInfoTitleRow title="Details" />
                            <ExtraInfoRow title="Release Date" value={selectedMovieDetail.release_date} />
                            <ExtraInfoRow title="Languages" value={selectedMovieDetail.spoken_languages.join(" • ")} />
                            <ExtraInfoRow title="Production Countries" value={selectedMovieDetail.production_countries.join(" • ")} />
                            <ExtraInfoRow title="Production Companies" value={selectedMovieDetail.production_companies.join(" • ")} />
                        </div>
                        <div className='movie-box-office-container'>
                            <ExtraInfoTitleRow title="Box Office" />
                            <ExtraInfoColumn title="Budget" value={formatMoneyValue(selectedMovieDetail.budget)} />
                            <br/>
                            <ExtraInfoColumn title="Revenue" value={formatMoneyValue(selectedMovieDetail.revenue)} />
                        </div>
                        <div className='movie-origin-info-container'>
                            <ExtraInfoTitleRow title="Origin Info" />
                            <ExtraInfoColumn title="Origin country" value={`${selectedMovieDetail.origin_country} • ${selectedMovieDetail.original_language}`} />
                            <br/>
                            <ExtraInfoColumn title="Original Title" value={selectedMovieDetail.original_title} />
                        </div>
                    </div>
                </div>
            ) : "Movie Detail was not found!"}
        </div>
    );
}

function formatMinuteToHourMinute(time: number): string {
    const hours = Math.floor(time/60);
    const minutes = time % 60;

    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

function formatMoneyValue(value: number): string {
    const valueArray: string[] = value.toString().split("");
    const length: number = valueArray.length;
    let resultValue: string[] = [];
    for(let i = 0; i < length; i++) {
        if(i % 3 === 0 && i !== 0) {
            resultValue.unshift(",");
        }
        resultValue.unshift(valueArray.pop()!)
    }
    return `$${resultValue.join("")}`;
}

function ExtraInfoRow({ title, value }: {title: string, value: string}) {
    return(
        <div className='extra-info-row'>
            <p className='extra-info-name'>{title}</p>
            <p className='extra-info-value'>{value}</p>
        </div>
    );
}

function ExtraInfoColumn({ title, value }: {title: string, value: string}) {
    return(
        <>
            <div className='extra-info-name'>{title}</div>
            <div className='extra-info-value'>{value}</div>
        </>
    );
}

function ExtraInfoTitleRow({ title }: {title: string}) {
    return(
        <div className='extra-info-title-row'>
            <div className='bar'></div>
            <div className='extra-info-title'>{title}</div>
        </div>
    );
}