const bcrypt = require('bcrypt');

module.exports = {
	register: async (req, res) => {
		// user inputs name, email, password
		// if email is in db, send 409
		// create a salt
		// hash password & salt
		// store name, email, hash in db
		const db = req.app.get("db");
		const {name, email, password} = req.body;
		let users = await db.get_user_by_email(email);
		let user = users[0];

		if (user) {
			return res.status(409).send("Your email is already in our database!")
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);

		let response = await db.create_user( {name, email, hash} );
		let createdUser = response[0];
		delete createdUser.password;

		req.session.user = createdUser;
		res.send(req.session.user);
	},
	login: async (req, res) => {
		// user input: email, password
		// get user by email from db
		// if no user, send 401
		// compare password w/ the hash using bcrypt
		// if they don't match, send 403
		// if they match, add user to session
		const db = req.app.get("db");
		const {email, password} = req.body;
		let users = await db.get_user_by_email(email);
		let user = users[0];

		if (!user) {
			return res.status(401).send("Your email or password is incorrect!");
		}

		let isAuthenticated = bcrypt.compareSync(password, user.password);
		if (!isAuthenticated) {
			return res.status(401).send("Your email or password is incorrect!");
		}

		delete user.password;

		req.session.user = user;
		res.send(req.session.user);
	},
	logout: (req, res) => {
		req.session.destroy();
		res.sendStatus(200);
	}
}