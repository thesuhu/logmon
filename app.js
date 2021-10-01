const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const hash = require('pbkdf2-password')()
const {
    port,
    secret
} = require('./config/config')
const routes = require('./src/routes')
const auth = require('./src/middleware/auth')

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'ejs')

app.get('/version', (req, res) => {
    res.send('Log Monitoring v.1.0.0')
})

// middleware
app.use(express.urlencoded({
    extended: false
}))

// init session
app.use(auth.useSession)

// Session-persisted message middleware
app.use(auth.sessionPersisted)

app.use(routes)

// 404
app.use((req, res, next) => {
    res.status(404).json({
        message: "Not Found!"
    })
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})