export const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;
export const TMDB_KEY = import.meta.env.VITE_TMDB_KEY; // <-- Adiciona isto
export const BASE_URL = 'https://www.omdbapi.com/';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w92'; // Tamanho pequeno para logótipos

export const GENEROS = [
  { id: 'Action', name: 'Ação' },
  { id: 'Comedy', name: 'Comédia' },
  { id: 'Drama', name: 'Drama' },
  { id: 'Horror', name: 'Terror' },
  { id: 'Sci-Fi', name: 'Ficção Científica' },
  { id: 'Animation', name: 'Animação' },
];