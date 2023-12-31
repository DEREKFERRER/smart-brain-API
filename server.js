const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controlers/register');
const signin  = require('./controlers/signin');
const profile  = require('./controlers/profile');
const image  = require('./controlers/image');

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false},
      host : process.env.DATABASE_HOST,
      port: 5432,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PW,
      database : process.env.DATABASE_DB
    }
  });

  db.select('*').from('users').then(data => {
    /* console.log(data); */
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=> {res.send(db.users)})
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
                                                                   //this is called dependency injection we're injecting whatever dependencies
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})

