import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!query.trim()) { setMovies([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&s=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.Response === 'False') { setMovies([]); setError(data.Error || 'Nenhum filme encontrado.'); }
        else { setMovies(data.Search || []); }
      } catch (err) { setError('Erro ao contactar a API.'); }
      finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = async (movie) => {
    setSelectedMovie(movie); setDetails(null);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&i=${movie.imdbID}&plot=full`);
      const data = await res.json();
      setDetails(data);
    } catch (err) { setDetails({ Plot: 'Erro ao carregar detalhes.' }); }
  };

  return (
    <>
      <header>
        <h1>🎬 Movie Search</h1>
        <SearchBar value={query} onChange={setQuery} />
      </header>
      <main className="main">
        {loading && <p className="status">A carregar...</p>}
        {error && !loading && <p className="status">❌ {error}</p>}
        {!loading && !error && !query && <p className="status">Começa a escrever para pesquisar filmes.</p>}
        <div className="movies-grid">
          {movies.map(movie => <MovieCard key={movie.imdbID} movie={movie} onClick={() => handleSelect(movie)} />)}
        </div>
      </main>
      {selectedMovie && <MovieModal movie={selectedMovie} details={details} onClose={() => { setSelectedMovie(null); setDetails(null); }} />}
    </>
  );
}

export default App;