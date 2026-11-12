import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OMDB_KEY, BASE_URL, GENEROS } from '../constants';
import DarkModeToggle from '../components/DarkModeToggle';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  
  const [pesquisa, setPesquisa] = useState('marvel');
  const [genero, setGenero] = useState('');
  const [ano, setAno] = useState('');

  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('meusFavoritos');
    return guardados ? JSON.parse(guardados) : [];
  });

  // Estado para o Utilizador (Login Google)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Escuta as mudanças de estado do login
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    const fetchFilmes = async () => {
      setLoading(true);
      setErro('');
      try {
        const termoPesquisa = genero ? `${pesquisa} ${genero}` : pesquisa;
        let url = `${BASE_URL}?apikey=${OMDB_KEY}&s=${termoPesquisa}`;
        if (ano) url += `&y=${ano}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === 'False') {
          setFilmes([]);
          setErro(data.Error || 'Nenhum filme encontrado.');
        } else {
          setFilmes(data.Search || []);
        }
      } catch (error) {
        setErro('Erro ao ligar à API.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (pesquisa) fetchFilmes();
    }, 500);

    return () => clearTimeout(timer);
  }, [pesquisa, ano, genero]);

  const toggleFavorito = (e, filme) => {
    e.preventDefault();
    const jaExiste = favoritos.find(f => f.imdbID === filme.imdbID);
    if (jaExiste) {
      setFavoritos(favoritos.filter(f => f.imdbID !== filme.imdbID));
    } else {
      setFavoritos([...favoritos, filme]);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="container">
      <header className="header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h1>🎬 Movie Search</h1>
        <input 
          type="text" 
          placeholder="Pesquisar filmes..." 
          className="search-input"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/favoritos" style={{ fontWeight: 'bold', color: 'var(--text-color)', textDecoration: 'none' }}>
            ❤️ Favoritos ({favoritos.length})
          </Link>
          
          {/* SISTEMA DE LOGIN */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src={user.photoURL} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.displayName.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-theme" style={{ fontSize: '0.8rem' }}>Sair</button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn-theme" style={{ fontSize: '0.9rem' }}>🔑 Entrar</button>
          )}
          
          <DarkModeToggle />
        </div>
      </header>

      <div className="filters">
        <select value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">Todos os Géneros</option>
          {GENEROS.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>

        <select value={ano} onChange={(e) => setAno(e.target.value)}>
          <option value="">Todos os Anos</option>
          {Array.from({ length: 30 }, (_, i) => 2025 - i).map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <h2 className="section-title">Resultados da Pesquisa</h2>
      {loading && <p className="loading">A carregar filmes...</p>}
      {erro && !loading && <p className="loading" style={{ color: 'red' }}>{erro}</p>}

      {!loading && !erro && (
        <div className="movie-grid">
          {filmes.map(filme => {
            const isFavorito = favoritos.some(f => f.imdbID === filme.imdbID);
            return (
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
                  className={`btn-fav ${isFavorito ? 'active' : ''}`}
                  onClick={(e) => toggleFavorito(e, filme)}
                >
                  {isFavorito ? '❤️' : '🤍'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Secção de Plataformas (mantida) */}
      <div className="dominio-publico-section" style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <h2 className="section-title">🎥 Onde Assistir</h2>
        <div className="filters" style={{ flexWrap: 'wrap' }}>
          <a href="https://www.rtp.pt/play/" target="_blank" rel="noopener noreferrer" className="btn-video" style={{ textDecoration: 'none' }}>🇵🇹 RTP Play (Legendas PT)</a>
          <a href="https://rakuten.tv/pt" target="_blank" rel="noopener noreferrer" className="btn-video" style={{ textDecoration: 'none' }}>📺 Rakuten TV</a>
          <a href="https://www.justwatch.com/pt" target="_blank" rel="noopener noreferrer" className="btn-video" style={{ textDecoration: 'none' }}>🍿 JustWatch</a>
          <a href="https://wikiflix.toolforge.org/" target="_blank" rel="noopener noreferrer" className="btn-video" style={{ textDecoration: 'none' }}>🎬 WikiFlix</a>
        </div>
      </div>
    </div>
  );
}