const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Configurações do app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MongoDB (use sua string de conexão)
mongoose.connect('mongodb://localhost:27017/tutoria-digital', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modelos de dados
const Tutoria = mongoose.model('Tutoria', new mongoose.Schema({
  nomeAluno: String,
  nomePai: String,
  nomeMae: String,
  endereco: String,
  celulares: String,
  telefone: String,
  serie: String,
  nomeTutor: String,
  projetoVida: String,
  assuntoPessoal: String,
  checkPessoal: Boolean,
  checkPedagogico: Boolean,
  checkFamilia: Boolean,
  checkEmergencia: Boolean,
  checkProvaPaulista: Boolean,
  checkNotasBimestrais: Boolean,
  checkComportamento: Boolean,
  carimboGestor: String,
  dataHora: String,
  assinaturaAluno: String,
  assinaturaGestor: String,
}));

// Rotas
app.get('/tutorias', async (req, res) => {
  const tutorias = await Tutoria.find();
  res.json(tutorias);
});

app.post('/tutorias', async (req, res) => {
  const novaTutoria = new Tutoria(req.body);
  await novaTutoria.save();
  io.emit('novaTutoria', novaTutoria); // Emite evento para todos os sockets conectados
  res.status(201).json(novaTutoria);
});

// Iniciar o servidor
server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

