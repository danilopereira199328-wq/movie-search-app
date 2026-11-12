import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favoritos from './pages/Favoritos'; // <-- Importa a nova página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favoritos" element={<Favoritos />} /> {/* <-- Nova rota */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;