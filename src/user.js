const hash = require('pbkdf2-password')()
const {
    JsonDB
} = require('node-json-db')
const {
    Config
} = require('node-json-db/dist/lib/JsonDBConfig')
const {
    authenticate
} = require('./middleware/auth')

var db = new JsonDB(new Config("mydatabase.json", true, true, '.'))

module.exports = {
    logout: (req, res) => {
        req.session.destroy(function() {
            res.redirect('/');
        })
    },
    login: (req, res) => {
        if (req.session.user) {
            res.status(200).json({
                message: "User is already logged in"
            })
        } else {
            res.render('login', {
                page: 'Login',
                menuId: 'login'
            })
        }
    },
    checkUser: (req, res) => {
        var rb = req.body
        authenticate(rb.username, rb.password, function(err, user) {
            if (user) {
                // Regenerate session when signing in
                // to prevent fixed
                req.session.regenerate(function() {
                    // Store the user's primary key
                    // in the session store to be retrieved, or in this case the entire user object
                    req.session.user = user
                    req.session.success = 'Authenticated as ' + user.name
                    res.redirect('/')
                });
            } else {
                req.session.error = 'Authentication failed, please check your username and password!'
                res.redirect('/login')
            }
        })
    },
    register: (req, res) => {
        if (req.session.user) {
            res.status(200).json({
                message: "Admin user has already been created"
            })
        } else {
            res.render('register', {
                page: 'Register',
                menuId: 'register'
            })
        }
    },
    createUser: (req, res) => {
        var rb = req.body
        hash({
            password: rb.password
        }, function(err, pass, salt, hash) {
            if (err) {
                console.log(err.message)
                res.status(500).json({
                    message: err.message
                })
                return
            } else {
                // store the salt & hash in the "db"
                db.push('db.users[]', {
                    username: rb.username,
                    salt: salt,
                    hash: hash
                }, true)
                res.redirect('/')
            }
        })
    }
}