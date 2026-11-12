import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const guardados = localStorage.getItem('meusFavoritos');
    if (guardados) setFavoritos(JSON.parse(guardados));
  }, []);

  const removerFavorito = (id) => {
    const novosFavoritos = favoritos.filter(f => f.imdbID !== id);
    setFavoritos(novosFavoritos);
    localStorage.setItem('meusFavoritos', JSON.stringify(novosFavoritos));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>❤️ Os Meus Favoritos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn-voltar">← Voltar à Home</Link>
          <DarkModeToggle />
        </div>
      </header>

      {favoritos.length === 0 ? (
        <p className="loading">Ainda não tens filmes favoritos. Vai à página inicial e clica no coração!</p>
      ) : (
        <div className="movie-grid">
          {favoritos.map(filme => (
            <div key={filme.imdbID} className="movie-card-wrapper">
              <Link to={`/movie/${filme.imdbID}`} className="movie-card">
                <img 
                  src={filme.Poster !== 'N/A' ? filme.Poster : 'https://placehold.co/500x750?text=Sem+Imagem'} 
                  alt={filme.Title} 
                />
                <div className="movie-card-info">
                  <h3>{filme.Title}</h3>
                  <p>{filme.Year}</p>
                </div>
              </Link>
              <button 
                className="btn-fav active"
                onClick={() => removerFavorito(filme.imdbID)}
                title="Remover dos favoritos"
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}