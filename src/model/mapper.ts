import type { IMovieDto, IMovieDetailDto } from "./DTO";
import type { IMovie, IMovieDetail } from "./model";

export function mapMovieDtoToMovie(dto: IMovieDto): IMovie {
    return {
        id: dto.id,
        poster_path: dto.poster_path ?? "",
        release_date: dto.release_date,
        title: dto.title,
        vote_average: dto.vote_average,
        vote_count: dto.vote_count
    };
}

export function mapMovieDetailDtoToMovieDetail(dto: IMovieDetailDto): IMovieDetail {
    return {
        id: dto.id,
        backdrop_path: dto.backdrop_path ?? "",
        poster_path: dto.poster_path ?? "",
        budget: dto.budget,
        genres: dto.genres.map(genre => genre.name),
        origin_country: dto.origin_country,
        original_language: dto.original_language,
        original_title: dto.original_title,
        overview: dto.overview,
        production_companies: dto.production_companies.map(company => company.name),
        production_countries: dto.production_countries.map(country => country.name),
        release_date: dto.release_date,
        revenue: dto.revenue,
        runtime: dto.runtime,
        spoken_languages: dto.spoken_languages.map(lang => lang.english_name),
        tagline: dto.tagline,
        title: dto.title,
        vote_average: dto.vote_average,
        vote_count: dto.vote_count
    };
}