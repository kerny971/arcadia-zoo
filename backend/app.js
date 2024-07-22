require('dotenv').config();

const bodyParser            = require('body-parser');
const express               = require('express');
const DashboardController   = require('./src/controller/DashboardController');
const PublicController      = require('./src/controller/PublicController')
const jwt                   = require('jsonwebtoken');
const db                    = require('./src/functions/Database');
const cors                  = require('cors');

// Express
const app = express();

// application/json parser
var jsonParser = bodyParser.json()

// application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })


app.use(cors())

app.use('/', jsonParser);
app.use('/', urlencodedParser);

app.post('/login', (req, res) => {

    const {email, password} = req.body;
    
    const connection = db.createConnection(db.credentials);


    if (!email || !password) {
        const status = {
            http_code: 404,
            error: true,
            message: 'Veuillez saisir votre email et mot de passe',
        }

        res.status(404).json({status});
        return;
    }

    const sql = 'SELECT * FROM utilisateur WHERE username = ? AND password = ?';

    connection.query(sql, [email, password], (error, results, fields) => {
        connection.end();

        if (error) {
            res.status(500).json({
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
        
                res.status(200).json({
                    status: {
                        http_code: 200,
                        error: false,
                        message: 'Connexion réussi',
                    },
                    token
                });
            } else {
                res.status(404).json({
                    status: {
                        http_code: 404,
                        error: true,
                        message: 'Identifiant ou mot de passe incorrecte',
                    }
                })
            }
        }
    })
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

app.use('/public', PublicController);

const listenPort = process.env.APP_LISTEN
app.listen(listenPort);