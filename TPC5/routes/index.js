const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to categorize composers by periods
function getPeriodos(compositores) {
    return compositores.reduce((periodos, compositor) => {
        periodos[compositor.periodo] = periodos[compositor.periodo] || [];
        periodos[compositor.periodo].push(compositor);
        return periodos;
    }, {});
}

// Routes
router.get('/', (req, res) => {
    res.render('index', { title: 'Plataforma de Compositores' });
});

router.get('/compositores', (req, res) => {
    axios.get("http://localhost:3000/compositores")
        .then(response => res.render('compositores', { title: 'Lista de compositores', compositores: response.data }))
        .catch(error => res.render('error', { error, message: 'Erro ao obter a lista de compositores' }));
});

router.route('/compositores/novo')
    .get((req, res) => {
        res.render('compositorForm', { compositor: {}, title: 'Novo compositor' });
    })
    .post((req, res) => {
        axios.post("http://localhost:3000/compositores", req.body)
            .then(response => res.redirect('/compositores/' + response.data.id))
            .catch(error => res.render('error', { error, message: 'Erro ao criar o compositor' }));
    });

router.get('/compositores/apagar/:id', (req, res) => {
    axios.delete(`http://localhost:3000/compositores/${req.params.id}`)
        .then(() => res.redirect('/compositores'))
        .catch(error => res.render('error', { error, message: 'Erro ao apagar o compositor' }));
});

router.route('/compositores/editar/:id')
    .get((req, res) => {
        axios.get(`http://localhost:3000/compositores/${req.params.id}`)
            .then(response => res.render('compositor-form', { compositor: response.data, title: 'Editar compositor' }))
            .catch(error => res.render('error', { error, message: 'Erro ao obter o compositor' }));
    })
    .post((req, res) => {
        axios.put(`http://localhost:3000/compositores/${req.params.id}`, req.body)
            .then(response => res.redirect('/compositores/' + response.data.id))
            .catch(error => res.render('error', { error, message: 'Erro ao editar o compositor' }));
    });

router.get('/compositores/:id', (req, res) => {
    axios.get(`http://localhost:3000/compositores/${req.params.id}`)
        .then(response => res.render('compositor-indiv', { title: 'Compositor', compositor: response.data }))
        .catch(error => res.render('error', { error, message: 'Erro ao obter o compositor' }));
});

router.get('/periodos', (req, res) => {
    axios.get("http://localhost:3000/compositores")
        .then(response => res.render('periodos', { title: 'Lista de periodos', periodos: getPeriodos(response.data) }))
        .catch(error => res.render('error', { error, message: 'Erro ao obter a lista de periodos' }));
});

router.get('/periodos/:periodo', (req, res) => {
    axios.get(`http://localhost:3000/compositores?periodo=${req.params.periodo}`)
        .then(response => res.render('periodos', { title: 'Lista de periodos', periodos: getPeriodos(response.data) }))
        .catch(error => res.render('error', { error, message: 'Erro ao obter a lista de compositores' }));
});

module.exports = router;
