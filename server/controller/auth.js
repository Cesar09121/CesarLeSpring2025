const express = require('express')
const router = express.Router()
const model = require('../models/user')

router
    .post('/login', (req, res, next) => {
        console.log("hi")
        const { username, password } = req.body
        
        model.login(username, password)
            .then(data => res.send(data))
            .catch(next)
    })
    .post('/logout', (req, res) => {
        res.send({ success: true, message: 'Logged out successfully' })
    })

module.exports = router