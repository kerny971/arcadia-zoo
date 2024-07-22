# arcadia-zoo

Application Arcadia Zoo (__ECF__)

## Partie Backend

### Installation

Installation des dépendances avec NPM

    npm install

Initialisation des variables d'environnement
Création d'un fichier .env avec les variables suivantes

    # APP
    APP_LISTEN="8000"

    # JWT
    JWT_SECRET_KEY="JWT_SECRET_KEY_971"
    JWT_ALGO="HS256"
    TOKEN_HEADER_KEY="gfg_token_header_key"

    # DATABASE
    HOST_DB="localhost"
    USER_DB="root"
    PASSWORD_DB=""
    DATABASE_DB="arcadia"
    PORT_DB="3306"

    # MAIL
    MAIL_HOST=
    MAIL_USERNAME=
    MAIL_PASSWORD=
    MAIL_AUTH=
    MAIL_PORT=

    MAIL_SENDER=Arcadia Zoo
    MAIL_SENDER_EMAIL=noreply@arcadia.test

### Lancement

lancement de l'application avec npm

    npm run start

lancement de l'application avec node

    node app.js


## Partie Frontend