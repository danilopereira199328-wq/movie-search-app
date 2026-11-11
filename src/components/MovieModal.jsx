function MovieModal({ movie, details, onClose }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=Sem+Poster';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={poster} alt={movie.Title} />
        <div className="modal-info">
          <h2>{movie.Title} ({movie.Year})</h2>
          {!details && <p>A carregar detalhes...</p>}
          {details && (
            <>
              <p><strong>Género:</strong> {details.Genre || 'N/A'}</p>
              <p><strong>Realizador:</strong> {details.Director || 'N/A'}</p>
              <p><strong>Atores:</strong> {details.Actors || 'N/A'}</p>
              <p><strong>Duração:</strong> {details.Runtime || 'N/A'}</p>
              <p><strong>Avaliação IMDb:</strong> ⭐ {details.imdbRating || 'N/A'}/10</p>
              <p><strong>Sinopse:</strong></p>
              <p>{details.Plot !== 'N/A' ? details.Plot : 'Sem sinopse disponível.'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default MovieModal;