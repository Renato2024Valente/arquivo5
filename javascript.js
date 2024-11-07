const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:3000/tutoria', { useNewUrlParser: true, useUnifiedTopology: true });

// Modelo de Usuário
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
}));

// Modelo de Tutoria
const Tutoria = mongoose.model('Tutoria', new mongoose.Schema({
    nomeAluno: String,
    serie: String,
    dataHora: String,
    assinaturaAluno: String,
    assinaturaGestor: String,
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

// Rota de Registro
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
    });
    await user.save();
    res.sendStatus(201);
});

// Rota de Login
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send('Credenciais inválidas');
    }

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Rota para Salvar Tutoria
app.post('/tutoria', async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, 'secret_key');

    const tutoria = new Tutoria({
        ...req.body,
        professor: decoded.id,
    });
    await tutoria.save();
    res.sendStatus(201);
});

// Iniciar o servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
