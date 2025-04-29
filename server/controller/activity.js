const model = require('../models/activity')
const data = require('../data/activity.json')
const express = require('express')
const router = express.Router()

router
    .get('/', (req, res, next) => {
        const { limit, offset, sort, order } = req.query
        
        model.getAll(num(limit), num(offset), sort, order).then((data) => {
            res.send(data)
        }).catch(next)
    })
    .get('/:id', (req, res, next) => {
        const { id } = req.params
        
        model.get(id).then((data) => {
            res.send(data)
        }).catch(next)
    })
    .post('/', (req, res, next) => {
        const activity = req.body
        
        model.create(activity).then((data) => {
            res.status(201).send(data)
        }).catch(next)
    })
    .patch('/:id', (req, res, next) => {
        const { id } = req.params
        const activity = req.body
        
        model.update(id, activity).then((data) => {
            res.send(data)
        }).catch(next)
    })
    .delete('/:id', (req, res, next) => {
        const { id } = req.params
        
        model.remove(id).then((data) => {
            res.send(data)
        }).catch(next)
    })
    .get('/stats/:userId', (req, res, next) => {
        const { userId } = req.params
        
        model.getStats(userId).then((data) => {
            res.send(data)
        }).catch(next)
    })
    .post('/seed', async (req, res) => {
        try {
            const result = await model.seed(); // Use model.seed instead of seed
            res.status(200).json(result);
        } catch (error) {
            console.error('Error seeding data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

module.exports = router

function num(value) {
    return value ? +value : undefined
}