const express = require('express')
const router = express.Router()
const model = require('../models/user')

router
  .post('/login', (req, res, next) => {
    console.log('Login request received:', req.body)
    
    const { username, password } = req.body
    
    console.log(`Attempting login for username: ${username}`)
    
    model.login(username, password)
      .then(data => {
        console.log('Login result:', data)
        res.send(data)
      })
      .catch(err => {
        console.error('Login error:', err)
        res.status(401).json({
          success: false,
          error: err.message || 'Authentication failed'
        })
      })
  })

module.exports = router