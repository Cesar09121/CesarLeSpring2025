const path = require('path')
require('dotenv').config()
const express = require('express')
const userController = require('./controller/user')
const activityController = require('./controller/activity')
const authController = require('./controller/auth')




const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '../client')))

// Routes

app.use('/api/v1/auth', authController)
app.use('/api/v1/user', userController)
app.use('/api/v1/activity', activityController)

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    }
})



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status ?? 500).json({
        message: err.message ?? 'Internal Server Error'
    })
})

// Port handling with auto-increment
const server = app.listen(PORT)
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is busy, trying ${PORT + 1}`)
            server.listen(PORT + 1)
        } else {
            console.error(err)
        }
    })
    .on('listening', () => {
        const addr = server.address()
        console.log(`Server running at http://localhost:${addr.port}`)
    })