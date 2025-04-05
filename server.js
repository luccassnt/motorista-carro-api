const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

const db = new sqlite3.Database('database.db', (err) => {
    if (err) console.error('Erro ao conectar ao banco:', err.message);
    else console.log('Conectado ao banco SQLite.');
});

db.run(`
    CREATE TABLE IF NOT EXISTS motorista_carro (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT, cpf TEXT, cnh TEXT, email TEXT, celular TEXT, endereco TEXT,
        placa TEXT, marca TEXT, modelo TEXT, ano INTEGER, cor TEXT, kmAtual REAL, sincronizado INTEGER
    )
`, (err) => {
    if (err) console.error('Erro ao criar tabela:', err.message);
    else console.log('Tabela motorista_carro criada ou já existe.');
});

app.get('/', (req, res) => res.send('Servidor funcionando!'));

app.post('/motorista_carro', (req, res) => {
    const { nome, cpf, cnh, email, celular, endereco, placa, marca, modelo, ano, cor, kmAtual, sincronizado } = req.body;
    const sql = `INSERT INTO motorista_carro (nome, cpf, cnh, email, celular, endereco, placa, marca, modelo, ano, cor, kmAtual, sincronizado)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nome, cpf, cnh, email, celular, endereco, placa, marca, modelo, ano, cor, kmAtual, sincronizado ? 1 : 0], function(err) {
        if (err) {
            console.error('Erro ao inserir:', err.message);
            res.status(500).json({ error: 'Erro ao salvar' });
        } else {
            console.log('Dados inseridos:', req.body);
            res.status(200).json({ message: 'Dados salvos com sucesso!', id: this.lastID });
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));