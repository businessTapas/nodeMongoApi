﻿const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const upload = require('_helpers/uploader');
const formidable = require('formidable');
const fs = require('fs');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({message: 'User registered successfully'}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

 async function update(req, res, next) {
    var fileNamePath = null;
    let flag = 1;
    try {
        await upload(req, res);
        //console.log(req.body.firstname);
         if (req.file !== undefined) {
            fileNamePath = req.file.path;
            req.body.imagefile = fileNamePath;
        } 
        
            console.log(req.body);
            userService.update(req.params.id, req.body)
            .then(() => res.json({message: "User updated successfully"}))
            .catch(err => {
                if(fileNamePath !== null){
                fs.unlink(fileNamePath, (error => {
                    if (error) console.log(error);
                  }));
                }
                next(err);
            });
     
        /* res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        }); */
      } catch (err) {
        next(err);
      }
    /* await upload(reqC, resC, function(err){
         if(err){
             flag = 0;
             resC.sendStatus(404);
         }
             if(reqC.file == undefined){
             }else{
                console.log(reqC.file);
                 fileName = reqC.file.path;
             }
     }); */
     
    if(flag == 1){
        /* const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            console.log(fields);
            userService.update(req.params.id, fields)
            .then(() => res.json({}))
            .catch(err => next(err));
        }) */
    }
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}