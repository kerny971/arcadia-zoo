require('dotenv').config();

const bodyParser            = require('body-parser');
const express               = require('express');
const DashboardController   = require('./src/controller/DashboardController');
const jwt                   = require('jsonwebtoken');
var mysql                   = require('mysql');

const app = express();


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const db = mysql.createConnection({
    host     : process.env.HOST_DB,
    user     : process.env.USER_DB,
    password : process.env.PASSWORD_DB,
    database : process.env.DATABASE_DB,
    port     : process.env.PORT_DB
});

app.post('/login', urlencodedParser, (req, res) => {

    const {email, password} = req.body;
    let status = {};

    if (!email || !password) {
        status = {
            http_code: 404,
            error: true,
            message: 'Veuillez saisir votre email et mot de passe',
        }

        res.json({status});
    } else {
        db.connect((err) => {

            if (err) { 
                res.json({
                    status: {
                        http_code: 500,
                        error: true,
                        message: 'Une erreur serveur s\'est produite...',
                    }
                }) 
            } else {
                const sql = 'SELECT * FROM utilisateur WHERE username = ? AND password = ?';

                db.query(sql, [email, password], (error, results, fields) => {
                    if (error) {
                        console.log(error)
                        res.json({
                            status: {
                                http_code: 500,
                                error: true,
                                message: 'Une erreur serveur s\'est produite...',
                            }
                        }) 
                    } else {
                        if (results.length > 0) {
                            const jwtSecretKey = process.env.JWT_SECRET_KEY;
                            const data = {
                                userId: 1,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
                            }
                    
                            const token = jwt.sign(data, jwtSecretKey, { 
                                algorithm: process.env.JWT_ALGO
                            });
                    
                            db.end();
                    
                            res.json({
                                status: {
                                    http_code: 200,
                                    error: true,
                                    message: 'Connexion réussi',
                                },
                                token
                            });
                        } else {
                            res.json({
                                status: {
                                    http_code: 403,
                                    error: true,
                                    message: 'Identifiant ou mot de passe incorrecte',
                                }
                            })
                        }
                    }
                })
            }
    
        })
    }
})

app.use('/dashboard', (req, res, next) => {
    const token = req.get('token');
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (decoded) {
            next();
        } else {
            res.json({
                status: {
                    http_code: 403,
                    error: true,
                    message: 'Accès non authorisé',
                }
            }) 
        }
    })
    
})
app.use('/dashboard', DashboardController);

const listenPort = process.env.APP_LISTEN
app.listen(listenPort);