const express = require('express')
const router = express.Router()
const model = require('../models/user')
const jwt = require('jsonwebtoken')

router
    .get('/', (req, res, next) => {
        const { limit, offset, sort, order } = req.query
        
        model.getAll(num(limit), num(offset), sort, order)
            .then(data => res.send(data))
            .catch(next)
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params
        
        model.get(id)
            .then(data => res.send(data))
            .catch(next)
    })
    .post('/', (req, res, next) => {
        const user = req.body
        
        model.create(user)
            .then(data => res.status(201).send(data))
            .catch(next)
    })
    .patch('/:id', (req, res, next) => {
        const { id } = req.params
        const user = req.body
        
        model.update(id, user)
            .then(data => res.send(data))
            .catch(next)
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params
        
        model.remove(id)
            .then(data => res.send(data))
            .catch(next)
    })
    
    .put('/:id', async (req, res, next) => {
        const updateUser = await update(req.params.id, req.body)
        res.json(updateUser)
    })
    
module.exports = router

function num(value) {
    return value ? +value : undefined
}