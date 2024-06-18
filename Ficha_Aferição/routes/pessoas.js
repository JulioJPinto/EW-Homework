var express = require('express');
var router = express.Router();
var pessoaController = require("../controllers/pessoa");

router.post('/registo', function(req, res, next) {
  pessoaController.insert(req.body)
    .then(function(pessoa) {
      res.status(201).json(pessoa);
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/', function(req, res, next) {
  pessoaController.list()
    .then(function(pessoas) {
      res.json(pessoas);
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/:id', function(req, res, next) {
  pessoaController.findById(req.params.id)
    .then(function(pessoa) {
      if (!pessoa) {
        return res.status(404).end();
      }
      res.json(pessoa);
    })
    .catch(function(err) {
      next(err);
    });
});

router.put('/:id', function(req, res, next) {
  pessoaController.update(req.params.id, req.body)
    .then(function(pessoa) {
      if (!pessoa) {
        return res.status(404).end();
      }
      res.json(pessoa);
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete('/:id', function(req, res, next) {
  pessoaController.remove(req.params.id)
    .then(function(pessoa) {
      if (!pessoa) {
        return res.status(404).end();
      }
      res.status(204).end();
    })
    .catch(function(err) {
      next(err);
    });
});

module.exports = router;
