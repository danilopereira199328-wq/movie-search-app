function MovieCard({ movie, onClick, isFavorite, onToggleFavorite }) {
  const poster = movie.Poster !== 'N/A'
    ? movie.Poster
    : 'https://via.placeholder.com/500x750?text=Sem+Poster';

  return (
    <div className="movie-card" onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <img src={poster} alt={movie.Title} loading="lazy" />
        <button
          onClick={onToggleFavorite}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'rgba(0,0,0,0.7)',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            fontSize: 18,
            color: isFavorite ? '#e94560' : 'white',
            display: 'grid',
            placeItems: 'center'
          }}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="movie-card-info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </div>
  );
}

export default MovieCard;