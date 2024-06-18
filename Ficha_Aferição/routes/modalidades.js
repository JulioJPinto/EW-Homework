var express = require('express');
var router = express.Router();
var modalidadeController = require("../controllers/modalidade");


router.get('/:modalidade', function(req, res, next) {
    modalidadeController.getPessoasPerModalidade(req.params.modalidade)
        .then(function(modalidades) {
            res.json(modalidades);
        })
        .catch(function(err) {
            next(err);
        });
});

router.get('/', function(req, res, next) {
    modalidadeController.listPerOrder()
        .then(function(modalidades) {
            res.json(modalidades);
        })
        .catch(function(err) {
            next(err);
        });
  });


router.post('/new', async (req, res) => {
    try {
        const modalidade = await modalidadeController.insert(req.body);
        res.status(201).json(modalidade);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const modalidade = await modalidadeController.update(req.params.id, req.body);
        res.json(modalidade);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await modalidadeController.remove(req.params.id);
        res.json({ message: 'Modalidade deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add/:nome', function(req, res) {
    modalidadeController.addPerson(req.params.nome, req.body)
      .then( resposta => {
        res.status(200).jsonp(resposta)
      })
  });


module.exports = router;
