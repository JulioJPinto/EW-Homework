const mongoose = require('mongoose');

const modalidadeSchema = new mongoose.Schema({
    nome: String,
    pessoas: [String]
});

const modalidade = mongoose.model('Modalidade', modalidadeSchema);
module.exports = modalidade;
