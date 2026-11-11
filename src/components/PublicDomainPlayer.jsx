import { useState } from 'react';

const PUBLIC_DOMAIN_FILMS = [
  // Filmes que já estavam a funcionar
  { id: 'Walkingshadows-NightOfTheLivingDeadSmallerFileSize234', title: 'Night of the Living Dead (1968)' },
  { id: 'carnival-of-souls-1962-restored', title: 'Carnival of Souls (1962)' },
  { id: 'TheGeneral1926', title: 'The General (1926)' },
  { id: 'Nosferatu1922', title: 'Nosferatu (1922)' },
  { id: 'white-zombie', title: 'White Zombie (1932) [Legendas PT]' },
  { id: '1963-a-assombracao-the-haunting-1.080p-legendado', title: 'A Assombração (1963) [Legendas PT]' },
  { id: 'ministry-of-fear-1944-legendado', title: 'Quando Descem as Trevas (1944) [Legendas PT]' },
  { id: 'wings.-1927.720p.-blu-ray.x-264.-yify', title: 'Wings (1927)' },

  // Filmes corrigidos
  { id: 'haxanwitchcraftthroughtheages1922', title: 'Häxan (1922)' },
  { id: 'the-day-the-earth-stood-still-colorized-1951-720p', title: 'O Dia em que a Terra Parou (1951)' },
];
  

function PublicDomainPlayer() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentFilm, setCurrentFilm] = useState(null);

  const loadFilm = async (film) => {
    setLoading(true);
    setError('');
    setVideoUrl(null);
    setCurrentFilm(film);

    try {
      const res = await fetch(`https://archive.org/metadata/${film.id}`);
      if (!res.ok) throw new Error('Não foi possível contactar o Internet Archive.');
      const data = await res.json();
      if (!data || !data.metadata) throw new Error('Filme não encontrado.');

      // Procura um ficheiro de vídeo MP4
      const videoFile = data.files.find(f =>
        f.format === 'MPEG4' || f.format === 'h.264' || f.format === '512Kb MPEG4' || (f.name && f.name.endsWith('.mp4'))
      );
      if (!videoFile) throw new Error('Este filme não tem um ficheiro de vídeo disponível.');

      const url = `https://archive.org/download/${film.id}/${videoFile.name}`;
      setVideoUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 40, padding: 20, background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: 10 }}>🎥 Filmes de Domínio Público</h2>
      <p className="status" style={{ padding: 0, textAlign: 'left', marginBottom: 15, fontSize: 14 }}>
        Assiste a clássicos do cinema que já estão em domínio público.
      </p>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {PUBLIC_DOMAIN_FILMS.map((film, index) => (
          <button
            key={index}
            onClick={() => loadFilm(film)}
            style={{
              padding: '10px 14px',
              background: currentFilm?.id === film.id ? 'var(--primary)' : 'var(--bg)',
              color: currentFilm?.id === film.id ? 'white' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {film.title}
          </button>
        ))}
      </div>

      {loading && <p className="status">A carregar filme...</p>}
      {error && <p className="status" style={{ color: '#f87171' }}>❌ {error}</p>}

      {videoUrl && (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <video key={videoUrl} controls style={{ width: '100%', borderRadius: 8, background: 'black' }}>
            <source src={videoUrl} type="video/mp4" />
            O teu browser não suporta a tag de vídeo.
          </video>
          <p style={{ fontSize: 12, color: 'var(--detail)', marginTop: 10, textAlign: 'center' }}>
            Fonte: Internet Archive (Domínio Público)
          </p>
        </div>
      )}
    </div>
  );
}

export default PublicDomainPlayer;