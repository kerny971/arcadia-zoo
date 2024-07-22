const express = require('express');
const db      = require('../functions/Database');
const mail    = require('../functions/Mail');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('dashboard');
})

// create user
router.post('/employe', (req, res) => {
    const {nom, prenom, email, password, type} = req.body
    const connection = db.createConnection(db.credentials);

    if (!nom || !prenom || !email || !password || !type) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Veuillez remplir tous les champs',
            }
        })
        return;
    } 

    const sql = 'INSERT INTO utilisateur (username, password, nom, prenom, role_role_id) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [email, password, nom, prenom, type], async (error, results, fields) => {
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

            try {
                const mailer = mail.createTransport(mail.credentials);
                await mailer.sendMail({
                    from: `${process.env.MAIL_SENDER}, <${process.env.MAIL_SENDER_EMAIL}>`, // sender address
                    to: `${prenom + ' ' + nom}, <${email}>`, // list of receivers
                    subject: "Création compte employé Arcadia Zoo", // Subject line
                    text: "Chèr(e) " + prenom +" : Votre compte employé à été créer. Veuillez-vous raprocher de l'administration afin de récupérer votre mot de passe", // plain text body
                    html: "Chèr(e) " + prenom +" : <br/> Votre compte employé à été créer. Veuillez-vous raprocher de l'administration afin de récupérer votre mot de passe", // html body
                });
            } catch (error) {
                console.log(error);
            }

            res.status(200).json({
                status: {
                    http_code: 200,
                    error: false,
                    message: 'Utilisateur enregistrée',
                }
            })
        }
    }) 

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


router.post('/service', (req, res) => {
    const {nom, description} = req.body
    const connection = db.createConnection(db.credentials);
    if (!nom || !description) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Veuillez remplir tous les champs',
            }
        });
    } else {
        const sql = 'INSERT INTO service (nom, description) VALUES (?, ?)';
        connection.query(sql, [nom, description], (error, results, fields) => {
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
                        message: 'Service ' + nom + ' enregistré',
                    }
                })
            }
        })
    }
})


router.delete('/service', (req, res) => {
    const {id} = req.body
    const connection = db.createConnection(db.credentials);

    if (!id) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Une erreur s\'est produite',
            }
        });
    } else {
        const sql = 'DELETE FROM service WHERE service_id = ?';
        connection.query(sql, [id], (error, results, fields) => {
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
                        message: 'Service Supprimé',
                    }
                })
            }
        })
    }
})




// CRUD Habitat
router.post('/habitat', (req, res) => {
    const {nom, description, commentaire} = req.body
    const connection = db.createConnection(db.credentials);
    if (!nom || !description || !commentaire) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Veuillez remplir tous les champs',
            }
        });

        return;
    } else {

        const sql = 'INSERT INTO habitat (nom, description, commentaire_habitat) VALUES (?, ?, ?)';
        connection.query(sql, [nom, description, commentaire], (error, results, fields) => {
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
                        message: 'Habitat ' + nom + ' enregistré',
                    }
                })
            }
        })

    }
})


router.delete('/habitat', (req, res) => {
    const {id} = req.body
    const connection = db.createConnection(db.credentials);
    if (!id) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Une erreur s\'est produite',
            }
        });
    } else {

        const sql = 'DELETE FROM habitat WHERE habitat_id = ?';
        connection.query(sql, [id], (error, results, fields) => {
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
            } else {                res.status(200).json({
                    status: {
                        http_code: 200,
                        error: false,
                        message: 'Habitat Supprimé',
                    }
                })
            }
        })
    }
})

router.get('/habitat', (req, res) => {

    const connection = db.createConnection(db.credentials);
    const sql = 'SELECT * FROM habitat';
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

router.post('/animal', (req, res) => {
    const {prenom, etat, habitat_id, race_id} = req.body
    const connection = db.createConnection(db.credentials);
    if (!prenom || !etat || !habitat_id || !race_id) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Veuillez remplir tous les champs',
            }
        });
    } else {
        const sql = 'INSERT INTO animal (prenom, etat, habitat_habitat_id, race_id_race) VALUES (?, ?, ?)';
        connection.query(sql, [prenom, etat, habitat_id, race_id], (error, results, fields) => {
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
                        message: 'Animal ' + nom + ' enregistré',
                    }
                })
            }
        })
    }
})

router.delete('/animal', (req, res) => {
    const {id} = req.body
    if (!id) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Une erreur s\'est produite',
            }
        });
    } else {

        const sql = 'DELETE FROM animal WHERE animal_id = ?';
        const connection = db.createConnection(db.credentials);

        connection.query(sql, [id], (error, results, fields) => {

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
                        message: 'Animal Supprimé',
                    }
                })
            }
        })
    }
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

router.post('/rapports-veterinaires', (req, res) => {

    const {date, detail, username, animal_id} = req.body

    const connection = db.createConnection(db.credentials);

    if (!date || !detail || !username || !animal_id) {
        res.status(404).json({
            status: {
                http_code: 404,
                error: true,
                message: 'Veuiller remplir tous les champs',
            }
        })
        return;
    }


    let sql = 'INSERT INTO rapport_veterinaire (date, detail, utilisateur_username, animal_animal_id) VALUES (?, ?, ?, ?)';
    
    connection.query(sql, [date, detail, username, animal_id], (error, results, fields) => {
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

router.post('/horaire/edit', (req, res) => {

    const {semaine, weekend} = req.body


    let sql = 'UPDATE horaire SET semaine = ?, weekend = ?';
    
    const connection = db.createConnection(db.credentials);

    connection.query(sql, [semaine, weekend], (error, results, fields) => {
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
                    message: 'Edition horaire',
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