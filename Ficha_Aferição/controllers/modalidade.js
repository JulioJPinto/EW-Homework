const Modalidade = require("../models/modalidade");
const Pessoa = require("../models/pessoa");

module.exports.list = () => {
    return Modalidade
        .find()
        .sort({ nome: 1 })
        .exec();
}

module.exports.findById = id => {
    return Modalidade
        .findOne({ _id: id })
        .exec();
}

module.exports.insert = modalidade => {
    if ((Modalidade.findOne({nome: modalidade.nome}).exec()) != null) {
        var newModalidade = new Modalidade(modalidade)
        return newModalidade.save()
    }
    else {
        return null
    }
}

module.exports.update = (id, modalidade) => {
    return Modalidade
        .findByIdAndUpdate(id, modalidade, { new: true })
        .exec();
}

module.exports.remove = id => {
    return Modalidade
        .findByIdAndDelete(id)
        .exec();
}

module.exports.addPessoa = (nome, person) => {
    return Modalidade
        .findOneAndUpdate({nome: nome}, {$push: {pessoas: person.id}})
        .exec()
}

module.exports.listPerOrder = async () => {
    try {
        const modalidades = await Modalidade.find().select('nome').sort('nome');
        const uniqueNames = [...new Set(modalidades.map(modalidade => modalidade.nome))];
        return uniqueNames;
    } catch (error) {
        console.error("Error occurred:", error);
        return [];
    }
};


module.exports.getPessoasPerModalidade = async (modalidade) => {
    try {
        const modalidadeObj = await Modalidade.findOne({ nome: modalidade }).exec();

        if (!modalidadeObj) {
            return [];
        }

        const pessoas_cods = modalidadeObj.pessoas;

        const nomes = await Promise.all(pessoas_cods.map(async (personId) => {
            const pessoa_schema = await Pessoa.findOne({ id: personId }).exec();
            return pessoa_schema?.nome;
        }));


        return nomes.sort();
        
    } catch (error) {
        console.error("Error occurred:", error);
        return [];
    }
};







