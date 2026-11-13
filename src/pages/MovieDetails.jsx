import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OMDB_KEY, BASE_URL, TMDB_KEY, TMDB_BASE_URL, TMDB_IMG_URL } from '../constants';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [filme, setFilme] = useState(null);
  const [sinopsePT, setSinopsePT] = useState('A traduzir sinopse...');
  const [providers, setProviders] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null); // Estado para o Trailer
  const [watchLink, setWatchLink] = useState(null); // Estado para o link de "Assistir"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      setLoading(true);
      try {
        // 1. Buscar dados ao OMDb
        const res = await fetch(`${BASE_URL}?apikey=${OMDB_KEY}&i=${id}&plot=full`);
        const data = await res.json();
        
        if (data.Response === 'True') {
          setFilme(data);
          
          // Traduzir Sinopse
          if (data.Plot && data.Plot !== 'N/A') {
            try {
              const resTrad = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(data.Plot)}&langpair=en|pt`);
              const dataTrad = await resTrad.json();
              setSinopsePT(dataTrad.responseData.translatedText);
            } catch (e) {
              setSinopsePT(data.Plot);
            }
          } else {
            setSinopsePT('Sem sinopse disponível.');
          }

          // 2. Buscar no TMDB (para Trailer e Onde Assistir)
if (data.imdbID && TMDB_KEY) {
  try {
    const resFind = await fetch(`${TMDB_BASE_URL}/find/${data.imdbID}?api_key=${TMDB_KEY}&external_source=imdb_id&language=pt-PT`);
    const dataFind = await resFind.json();
    
    if (dataFind.movie_results && dataFind.movie_results.length > 0) {
      const tmdbId = dataFind.movie_results[0].id;
      
      // A) BUSCAR TRAILER (Com Fallback de Idioma e Tipo)
      let trailerEncontrado = null;

      // Tentativa 1: Português
      const resVideosPT = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_KEY}&language=pt-PT`);
      const dataVideosPT = await resVideosPT.json();
      trailerEncontrado = dataVideosPT.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

      // Tentativa 2: Inglês (Fallback)
      if (!trailerEncontrado) {
        const resVideosEN = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_KEY}&language=en-US`);
        const dataVideosEN = await resVideosEN.json();
        trailerEncontrado = dataVideosEN.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
      }

      // Tentativa 3: Qualquer vídeo do YouTube (último recurso)
      if (!trailerEncontrado) {
        const resVideosAll = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_KEY}`);
        const dataVideosAll = await resVideosAll.json();
        trailerEncontrado = dataVideosAll.results?.find(v => v.site === 'YouTube');
      }

      if (trailerEncontrado) setTrailerKey(trailerEncontrado.key);
      
      // B) BUSCAR ONDE ASSISTIR (Providers) - Mantém-se igual
      const resProviders = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}/watch/providers?api_key=${TMDB_KEY}`);
      const dataProviders = await resProviders.json();
      
      if (dataProviders.results && dataProviders.results.PT) {
        setProviders(dataProviders.results.PT.flatrate || []);
        if (dataProviders.results.PT.link) {
          setWatchLink(dataProviders.results.PT.link);
        }
      } else {
        setProviders([]);
      }
    }
  } catch (e) {
    console.error("Erro no TMDB:", e);
  }
}
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhes();
  }, [id]);

  if (loading) return <div className="container loading">A carregar detalhes...</div>;
  if (!filme) return <div className="container">Filme não encontrado.</div>;

  return (
    <div className="container details-container">
      <button onClick={() => navigate(-1)} className="btn-voltar">← Voltar</button>
      
      <div className="details-header">
        <img 
          src={filme.Poster !== 'N/A' ? filme.Poster : 'https://placehold.co/300x450?text=Sem+Imagem'} 
          alt={filme.Title} 
          className="details-poster"
        />
        <div className="details-info">
          <h1>{filme.Title} <span>({filme.Year})</span></h1>
          <p><strong>Duração:</strong> {filme.Runtime}</p>
          <p><strong>Géneros:</strong> {filme.Genre}</p>
          <p><strong>Avaliação IMDb:</strong> ⭐ {filme.imdbRating}/10</p>
          <p><strong>Realizador:</strong> {filme.Director}</p>
          <p><strong>Atores:</strong> {filme.Actors}</p>
          <p className="sinopse"><strong>Sinopse:</strong> {sinopsePT}</p>

          {/* BOTÕES DE AÇÃO: TRAILER E ASSISTIR */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {trailerKey && (
              <a 
                href={`https://www.youtube.com/watch?v=${trailerKey}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-video"
                style={{ textDecoration: 'none', backgroundColor: '#e50914', color: 'white', padding: '0.8rem 1.5rem', fontWeight: 'bold' }}
              >
                ▶️ Ver Trailer
              </a>
            )}

            {watchLink && (
              <a 
                href={watchLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-video"
                style={{ textDecoration: 'none', backgroundColor: '#00b4d8', color: 'white', padding: '0.8rem 1.5rem', fontWeight: 'bold' }}
              >
                🎬 Onde Assistir
              </a>
            )}
          </div>

          {/* SECÇÃO DE LOGÓTIPOS DAS PLATAFORMAS */}
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3>Disponível em Portugal:</h3>
            {providers === null ? (
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>A procurar plataformas...</p>
            ) : providers.length > 0 ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                {providers.map(p => (
                  <div key={p.provider_id} style={{ textAlign: 'center' }}>
                    <img 
                      src={`${TMDB_IMG_URL}${p.logo_path}`} 
                      alt={p.provider_name} 
                      title={p.provider_name}
                      style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Não há dados de streaming registados para este filme.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}