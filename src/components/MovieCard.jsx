function MovieCard({ movie, onClick }) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500x750?text=Sem+Poster';
  return (
    <div className="movie-card" onClick={onClick}>
      <img src={poster} alt={movie.Title} loading="lazy" />
      <div className="movie-card-info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </div>
  );
}
export default MovieCard;