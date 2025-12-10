import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve `telas/` first so requests like `/cadastro.html` resolve to `telas/cadastro.html`
app.use(express.static(path.join(__dirname, '..', 'telas')));

// Then serve the project root so `/js`, `/css`, `/assets` are available
app.use(express.static(path.join(__dirname, '..')));

// --- Proxy configuration for API routes (forward to backend FastAPI)
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxyOptions = {
  target: 'http://localhost:8000',
  changeOrigin: true,
  logLevel: 'warn'
};

// Proxy common API prefixes used by the frontend to the backend
app.use('/criancas', createProxyMiddleware(proxyOptions));
app.use('/enderecos', createProxyMiddleware(proxyOptions));
app.use('/filiacao', createProxyMiddleware(proxyOptions));
app.use('/denunciante', createProxyMiddleware(proxyOptions));
app.use('/relatorios', createProxyMiddleware(proxyOptions));
app.use('/encaminhamentos', createProxyMiddleware(proxyOptions));
// Optional: proxy any `/api/*` prefixed calls to backend root
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  logLevel: 'warn'
}));

// Optional API route kept for backwards compatibility
app.get("/api/criancas", (req, res) => {
  res.json([
    { id: 1, nome: "Maria", data_nascimento: "2015-03-12" }
  ]);
});

// Root -> telas/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'telas', 'index.html'));
});

app.listen(3000, () =>
  console.log("Rodando em http://localhost:3000")
);
