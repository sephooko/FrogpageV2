const mysql2 = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');

const sqlConnection =  mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "Geor678ge",
    database: "frogbase"
})

// sqlConnection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected");
// })

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get("/", function(request, response){
    response.sendFile(path.join(__dirname + '/../html/login.html'));
});

app.post('/auth', function(request, response){
    let username = request.body.username;
    let password = request.body.password;
    if(username&&password){
        sqlConnection.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], function(err, results, fields){
            if (err) throw err;
            if (results.length>0) {
                request.session.loggedin = true;
				request.session.username = username;
                response.redirect('/home')
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
		response.end();
    }
})

app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});
app.listen(3000);
