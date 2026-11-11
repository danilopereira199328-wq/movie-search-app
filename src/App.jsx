import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

const POPULAR_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0071562', // The Godfather Part II
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0110912', // Pulp Fiction
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0109830', // Forrest Gump
  'tt0137523', // Fight Club
  'tt1375666', // Inception
];

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movie-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  // Carregar filmes populares na primeira vez
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const promises = POPULAR_IDS.slice(0, 12).map(id =>
          fetch(`https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&i=${id}`).then(r => r.json())
        );
        const results = await Promise.all(promises);
        setPopular(results.filter(m => m.Response !== 'False'));
      } catch (err) {
        console.error('Erro ao carregar populares:', err);
      }
    };
    fetchPopular();
  }, []);

  // Guardar favoritos no localStorage sempre que mudam
  useEffect(() => {
    localStorage.setItem('movie-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Pesquisa com debounce
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

  const toggleFavorite = (movie, e) => {
    e.stopPropagation();
    const exists = favorites.find(f => f.imdbID === movie.imdbID);
    if (exists) {
      setFavorites(favorites.filter(f => f.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (movie) => favorites.some(f => f.imdbID === movie.imdbID);

  const listToShow = showFavorites ? favorites : (query ? movies : popular);
  const showHeader = !showFavorites && !query && popular.length > 0;

  return (
    <>
      <header>
        <h1>🎬 Movie Search</h1>
        <SearchBar value={query} onChange={setQuery} />
        <div style={{ marginTop: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={() => setShowFavorites(false)}
            style={{
              padding: '8px 16px',
              background: !showFavorites ? 'var(--primary)' : 'var(--card)',
              color: !showFavorites ? 'white' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            {query ? 'Resultados' : 'Populares'}
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            style={{
              padding: '8px 16px',
              background: showFavorites ? 'var(--primary)' : 'var(--card)',
              color: showFavorites ? 'white' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            ♥ Favoritos ({favorites.length})
          </button>
        </div>
      </header>

      <main className="main">
        {showHeader && <h2 style={{ marginBottom: 20, color: 'var(--primary)' }}>⭐ Filmes Populares</h2>}
        {showFavorites && <h2 style={{ marginBottom: 20, color: 'var(--primary)' }}>♥ Os teus favoritos</h2>}
        {query && !showFavorites && <h2 style={{ marginBottom: 20, color: 'var(--primary)' }}>🔍 Resultados para "{query}"</h2>}

        {loading && <p className="status">A carregar...</p>}
        {error && !loading && <p className="status">❌ {error}</p>}
        {!loading && !query && !showFavorites && popular.length === 0 && <p className="status">A carregar filmes populares...</p>}
        {showFavorites && favorites.length === 0 && <p className="status">Ainda não tens favoritos. Clica no ♥ de um filme para o guardares.</p>}

        <div className="movies-grid">
          {listToShow.map(movie => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={() => handleSelect(movie)}
              isFavorite={isFavorite(movie)}
              onToggleFavorite={(e) => toggleFavorite(movie, e)}
            />
          ))}
        </div>
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          details={details}
          onClose={() => { setSelectedMovie(null); setDetails(null); }}
        />
      )}
    </>
  );
}

export default App;