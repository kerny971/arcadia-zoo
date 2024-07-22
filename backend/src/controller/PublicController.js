const express = require('express');
const db      = require('../functions/Database');
const mail    = require('../functions/Mail');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('public');
})


// CRUD Service
router.get('/service', (req, res) => {

    const sql = 'SELECT * FROM service';
    const connection = db.createConnection(db.credentials);

    connection.query(sql, (error, results, fields) => {

        connection.end()

        if (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    http_code: 500,
                    error: true,
                    message: 'Une erreur serveur s\'est produite...',
                }
            })
        } else {
            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'Tous les services',
                },
                data: {
                    services: results
                }
            })
        }
    })
})


// CRUD HABITAT
router.get('/habitat', (req, res) => {

    const connection = db.createConnection(db.credentials);
    const sql = `SELECT 
            habitat.nom AS habitat_nom,
            habitat.description AS habitat_description,
            habitat.commentaire_habitat AS habitat_commentaire,
            image.image_data AS habitat_image,
            
            
            CONCAT(
            '[',
            GROUP_CONCAT(
            JSON_OBJECT(
                'animal_prenom', animal.prenom,
                'animal_etat', animal.etat,
                'animal_race', race.label,
                'animal_rapport', rapport_veterinaire.detail,
                'animal_rapport_date', rapport_veterinaire.date
            )
            SEPARATOR ','
            ),
            ']'
        ) AS animal_list
            
        FROM habitat

        LEFT JOIN animal ON animal.habitat_habitat_id = habitat.habitat_id
        LEFT JOIN race ON animal.race_id_race = race.id_race
        LEFT JOIN rapport_veterinaire ON rapport_veterinaire.animal_animal_id = animal.animal_id
        LEFT JOIN image ON image.habitat_habitat_id = habitat.habitat_id

        GROUP BY habitat.nom, habitat.description, habitat.commentaire_habitat, image.image_data`;

    connection.query(sql, (error, results, fields) => {
        connection.end();

        if (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    http_code: 500,
                    error: true,
                    message: 'Une erreur serveur s\'est produite...',
                }
            })
        } else {
            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'Tous les habitats',
                },
                data: {
                    habitats: results
                }
            })
        }
    })
})



// CRUD Animal
router.get('/animal', (req, res) => {
    const sql = 'SELECT * FROM animal';
    const connection = db.createConnection(db.credentials);
    connection.query(sql, (error, results, fields) => {

        connection.end();

        console.log(results);
        if (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    http_code: 500,
                    error: true,
                    message: 'Une erreur serveur s\'est produite...',
                }
            })
        } else {
            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'Tous les animaux',
                },
                data: {
                    animaux: results
                }
            })
        }
    })

})



// CRUD Compte Rendu
router.get('/rapports-veterinaires', (req, res) => {

    const {date, animal_id} = req.body

    const connection = db.createConnection(db.credentials);


    let sql = 'SELECT * FROM rapport_veterinaire';
    const paramQuery = [];
    
    if (date) {
        const dateRapport = new Date(date);
        const ISOdate = dateRapport.toISOString().slice(0, 10);
        sql += ' WHERE date = ?';
        paramQuery.push(ISOdate);
    } else if (animal_id) {
        sql += "WHERE animal_animal_id = ?";
        paramQuery.push(animal_id);
    }

    connection.query(sql, paramQuery, (error, results, fields) => {
        connection.end();
        if (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    http_code: 500,
                    error: true,
                    message: 'Une erreur serveur s\'est produite...',
                }
            })
        } else {
            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'Les rapports Vétérinaires',
                },
                data: {
                    rapports: results
                }
            })
        }
    })
})


// CRUD horaire
router.get('/horaire', (req, res) => {

    let sql = 'SELECT * FROM horaire LIMIT 1';            
    const connection = db.createConnection(db.credentials);

    connection.query(sql, (error, results, fields) => {
        connection.end();

        if (error) {
            console.log(error);
            res.status(500).json({
                status: {
                    http_code: 500,
                    error: true,
                    message: 'Une erreur serveur s\'est produite...',
                }
            })
        } else {
            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'horaires',
                },
                data: {
                    horaires: results
                }
            })
        }
    })
})


// CRUD contact
router.post('/contact', async (req, res) => {

    const {email, titre, description } = req.body

    if (!email || !titre || !description) {
        const status = {
            http_code: 404,
            error: true,
            message: 'Veuillez saisir vos donnés',
        }

        res.status(404).json({status});
        return;
    }

    try {
        console.log(mail);
        const mailer = mail.createTransport(mail.credentials);
        await mailer.sendMail({
            from: `${process.env.MAIL_SENDER}, <${process.env.MAIL_SENDER_EMAIL}>`, // sender address
            to: `Arcadia Zoo, <contact@arcadia.test>`, // list of receivers
            subject: "Message de " + email, // Subject line
            text: `email : ${email}, titre: ${titre}, description: ${description}`, // plain text body
            html: `email : ${email}, titre: ${titre}, description
            : ${description}`, // html body
        });

        res.status(200).json({
            status: {
                http_code: 200,
                error: false,
                message: 'Message envoyé',
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: {
                http_code: 500,
                error: false,
                message: 'Une erreur à eu lieu...',
            }
        })
    }

})

module.exports = router