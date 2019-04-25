const express = require('express');
require('dotenv').config();
const massive = require('massive');
const session = require('express-session');

const app = express();
const AuthCtrl = require('./controllers/Auth');
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env;

massive(CONNECTION_STRING).then(db => {
	app.set("db", db);
	console.log("db connected");
})

app.use(express.json());
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}))

app.post('/auth/register', AuthCtrl.register);
app.post('/auth/login', AuthCtrl.login);
app.get('/auth/logout', AuthCtrl.logout);

app.listen(SERVER_PORT, () => console.log(`port ${SERVER_PORT} lenny face`));