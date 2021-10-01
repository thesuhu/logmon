const session = require('express-session')
const hash = require('pbkdf2-password')()
const {
    JsonDB
} = require('node-json-db')
const {
    Config
} = require('node-json-db/dist/lib/JsonDBConfig')

var db = new JsonDB(new Config("mydatabase.json", true, true, '.'))

// init data user
db.push('db.users[0]', {
    username: "",
    salt: "",
    hash: "",
}, true)

module.exports = {
    useSession: session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: "Not all treasure's silver and gold, mate."
    }),
    sessionPersisted: (req, res, next) => {
        var err = req.session.error
        var msg = req.session.success
        delete req.session.error
        delete req.session.success
        res.locals.message = ''
        if (err) res.locals.message = `<div class="alert alert-danger alert-dismissible fade show mt-4" role="alert">` + err + `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        if (msg) res.locals.message = `<div class="alert alert-success alert-dismissible fade show mt-4" role="alert">` + msg + `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        next()
    },
    restrict: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            // check initial admin user
            db.reload()
            let users = db.getData("db.users")
            if (users.length == 1) {
                if (req.path.split('/')[1] == 'register') {
                    next()
                } else {
                    res.redirect('/register')
                }
            } else {
                if (req.path == '/') {
                    req.session.error = ''
                } else {
                    req.session.error = 'Access denied, please login first!'
                }
                if (req.path.split('/')[1] == 'api') {
                    res.status(401).json({
                        message: "Unauthorized!"
                    })
                } else {
                    if (req.path.split('/')[1] == 'login') {
                        next()
                    } else {
                        res.redirect('/login')
                    }
                }
            }
        }
    },
    authenticate: (name, pass, fn) => {
        // find user in db
        var userIndex = db.getIndex('db.users', name, 'username')
        if (userIndex < 0) {
            return fn(new Error('Cannot find user'))
        }
        var user = db.getData(`db.users[${userIndex}]`)
            // check password with the hash against the pass/salt, if there is a match we found the user
        hash({
            password: pass,
            salt: user.salt
        }, function(err, pass, salt, hash) {
            if (err) {
                fn(err)
            }
            if (hash === user.hash) {
                return fn(null, user)
            } else {
                fn(new Error('Invalid password'))
            }
        })
    }
}