# 🎬 Movie Search App

Uma aplicação de pesquisa de filmes construída com **React** e **Vite**, que consome a API da **OMDb** para pesquisar filmes e inclui um player de **filmes de domínio público** do Internet Archive.

🔗 **Projeto Online:** [movie-search-app-ten.vercel.app](https://movie-search-app-ten.vercel.app)

---

## 📸 Captura de Ecrã
 `![Movie Search App](screenshot.png)`]

---

## 🛠️ Stack Tecnológica

- **React 19** + **Vite** — frontend moderno e rápido
- **OMDb API** — dados de filmes (título, sinopse, poster, avaliação)
- **Internet Archive** — filmes de domínio público (legais e gratuitos)
- **localStorage** — persistência dos favoritos no browser
- **CSS puro** — design responsivo com tema escuro
- **Vercel** — deploy automático a cada `git push`

---

## ✨ Funcionalidades

- **Pesquisa de filmes** com **debounce** (evita pedidos desnecessários à API)
- **Filmes populares** na página inicial (top 12 clássicos do IMDb)
- **Modal de detalhes** com sinopse, género, realizador, atores, duração e avaliação IMDb
- **Sistema de favoritos** com `localStorage` (persiste mesmo depois de fechar o browser)
- **Player de filmes de domínio público** com 10 clássicos do cinema:
  - Night of the Living Dead (1968)
  - Carnival of Souls (1962)
  - The General (1926)
  - Nosferatu (1922)
  - White Zombie (1932) — com legendas PT
  - A Assombração (1963) — com legendas PT
  - Quando Descem as Trevas (1944) — com legendas PT
  - Wings (1927)
  - Häxan (1922)
  - O Dia em que a Terra Parou (1951)
- **Design responsivo** com tema escuro

---

## 🧠 Decisões Técnicas (para entrevistas)

- **Debounce na pesquisa:** Usei `setTimeout` no `useEffect` para só fazer o pedido à API quando o utilizador para de escrever, evitando sobrecarregar o servidor.
- **Estado explícito:** O `loading` e o `error` são geridos separadamente, para o utilizador saber sempre o que está a acontecer.
- **Modal com segundo pedido:** O `MovieModal` faz um segundo pedido à API (`?i=imdbID&plot=full`) para obter a sinopse completa, em vez de sobrecarregar a pesquisa inicial.
- **Favoritos com `localStorage`:** O estado dos favoritos é persistido no browser, para sobreviver a recarregamentos.
- **Player de domínio público:** O Internet Archive serve filmes legais e gratuitos. O player usa a tag `<video>` nativa do HTML5, com suporte para legendas (`.vtt`).
- **Link direto vs. ID:** Para alguns filmes, o ficheiro `.mp4` tem de ser referenciado diretamente; para outros, a função procura o ficheiro automaticamente via API de metadados do Archive.

---

## ⚙️ Como correr localmente

1. **Clona o repositório:**
   ```bash
   git clone https://github.com/danilopereira199328-wq/movie-search-app.git
   cd movie-search-app