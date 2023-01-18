const express = require('express');
const router = express.Router();
const departmentService = require('./department.service'); 

// routes
router.post('/create', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;


function create(req, res, next) {
    departmentService.create(req.body)
        .then(() => res.json({message: 'User registered successfully'}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    departmentService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    departmentService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    departmentService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    departmentService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}