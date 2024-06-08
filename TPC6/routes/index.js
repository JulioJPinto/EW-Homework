const express = require("express");
const router = express.Router();
const compositorController = require("../controllers/compositor");

router.get("/", (req, res) => {
  res.render("index", { title: "Compositores" });
});

router.get("/compositores", (req, res) => {
  compositorController
    .list()
    .then(compositores => res.render("compositores", { title: "Lista de compositores", compositores }))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao obter a lista de compositores" }));
});

router.get("/compositores/novo", (req, res) => {
  res.render("compositor-form", { compositor: {}, title: "Novo compositor" });
});

router.post("/compositores/novo", (req, res) => {
  compositorController
    .insert(req.body)
    .then(() => res.redirect("/compositores/" + req.body._id))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao criar o compositor" }));
});

router.get("/compositores/apagar/:id", (req, res) => {
  compositorController
    .removeById(req.params.id)
    .then(() => res.redirect("/compositores"))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao apagar o compositor" }));
});

router.get("/compositores/editar/:id", (req, res) => {
  compositorController
    .findById(req.params.id)
    .then(compositor => res.render("compositor-form", { compositor, title: "Editar compositor", id_changeable: false }))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao obter o compositor" }));
});

router.post("/compositores/editar/:id", (req, res) => {
  compositorController
    .update(req.params.id, req.body)
    .then(() => res.redirect("/compositores/" + req.params.id))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao editar o compositor" }));
});

router.get("/compositores/:id", (req, res) => {
  compositorController
    .findById(req.params.id)
    .then(compositor => res.render("compositor", { title: "Compositor", compositor }))
    .catch(erro => res.render("error", { error: erro, message: "Erro ao obter o compositor" }));
});

const getPeriodos = compositores => {
  return compositores.reduce((periodosDict, compositor) => {
    if (!periodosDict[compositor.periodo]) {
      periodosDict[compositor.periodo] = [];
    }
    periodosDict[compositor.periodo].push(compositor);
    return periodosDict;
  }, {});
};

router.get("/periodos", (req, res) => {
  compositorController
    .list()
    .then(compositores => {
      const periodosDict = getPeriodos(compositores);
      res.render("periodos", { title: "Lista de periodos", periodos: periodosDict });
    })
    .catch(erro => res.render("error", { error: erro, message: "Erro ao obter a lista de periodos" }));
});

router.get("/periodos/:periodo", (req, res) => {
  compositorController
    .findByPeriodo(req.params.periodo)
    .then(compositores => {
      const periodosDict = getPeriodos(compositores);
      res.render("periodos", { title: "Lista de periodos", periodos: periodosDict });
    })
    .catch(erro => res.render("error", { error: erro, message: "Erro ao obter a lista de compositores" }));
});

module.exports = router;
