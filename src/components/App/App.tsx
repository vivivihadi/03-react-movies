import { useState } from 'react';
import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    
    const handleSubmit = async (query: string) => {
        try {
            setIsLoading(true);
            setIsError(false);
            setMovies([]);
            const data = await fetchMovies(query);
            if (data.length === 0) {
               toast.error('No movies found for your request.'); 
            }
            setMovies(data);
        } catch {
            setIsError(true);
            setMovies([]);
            
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieSelect = (movie: Movie) => {
        if (movie) {
            setSelectedMovie(movie);
        }
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div className={css.app}>
            <SearchBar
                onSubmit={handleSubmit}
            />
            <Toaster/>
            {isLoading && <Loader />}
            {isError && <ErrorMessage />}
            {movies.length > 0 &&
                <MovieGrid movies={movies} onSelect={handleMovieSelect} />
            }
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal}/>
            )}
        </div>
    );
}