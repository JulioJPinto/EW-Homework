const Pessoa = require("../models/pessoa");

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({ nome: 1 })
        .exec();
}

module.exports.findById = id => {
    return Pessoa
        .findOne({ _id: id })
        .exec();
}

module.exports.insert = pessoa => {
    if ((Pessoa.findOne({id: pessoa.id}).exec()) != null) {
        var pessoa = new Pessoa(pessoa)
        return pessoa.save()
    }
    else {
        return null
    }
}

module.exports.update = (id, pessoa) => {
    return Pessoa
        .findByIdAndUpdate(id, pessoa, { new: true })
        .exec();
}

module.exports.remove = id => {
    return Pessoa
        .findByIdAndDelete(id)
        .exec();
}
