require('dotenv').config();
const express = require('express');
const DashboardController = require('./src/controller/DashboardController');
const jwt = require('jsonwebtoken'); 

const app = express();


app.use('/login', (req, res, next) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const data = {
        userId: 1,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }

    const token = jwt.sign(data, jwtSecretKey, { 
        algorithm: process.env.JWT_ALGO
    });
    res.json({
        token
    });
})

app.use('/dashboard', (req, res, next) => {
    next();
})


const listenPort = process.env.APP_LISTEN
app.listen(listenPort);