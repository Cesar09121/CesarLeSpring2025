const path = require('path')
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const userController = require('./controller/user')
const activityController = require('./controller/activity')
const authController = require('./controller/auth')
const postsController = require('./controller/posts')





const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/index.html')))
app.use(cors());



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  })
    app.use(express.json())

// Routes

app.use('/api/v1/auth', authController)
app.use('/api/v1/users', userController)
app.use('/api/v1/activity', activityController)
app.use('/api/v1/posts', postsController)

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'))
    }
})

app.get('/api/v1/test', (req, res) => {
    console.log('Test endpoint hit')
    res.json({ message: 'Server is working' })
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