const express = require('express')
const router = express.Router()
const monit = require('./monit')
const about = require('./about')
const user = require('./user')
const index = require('./index')
const {
    restrict
} = require('../src/middleware/auth')


// render
router.get('/', restrict, index.index)
router.get('/login', restrict, user.login)
router.get('/logout', restrict, user.logout)
router.get('/register', restrict, user.register)
router.get('/monit', restrict, monit.viewpage)
router.get('/about', restrict, about)

// API
router.get('/api/monit', restrict, monit.logfiles)
router.get('/api/monit/download', restrict, monit.downloadFile)
router.get('/api/monit/viewfile', restrict, monit.readFile)
router.post('/api/login', user.checkUser)
router.post('/api/register', user.createUser)

module.exports = router