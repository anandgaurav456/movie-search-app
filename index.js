const express = require('express');
const colors = require('colors');
const request = require('request');
const mongoose = require('mongoose');
require('dotenv').config()
/*
EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.
No religiousness about how to organize things. 
No reinvention of iteration and control-flow. 
It's just plain JavaScript.
*/
app = express()
app.set('views engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

// MongoDB Connection
const MongoURL = "mongodb://localhost:27017/login";
mongoose.connect(MongoURL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected DB".brightGreen.bold)
});

// Defining Schema 
const UserSchema = mongoose.Schema({
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  });

// HomePage Route
app.get('/', (req, res)=>{
    res.render('homepage.ejs')
})

// Search Results Route
app.get('/result', (req, res)=>{
    movieName = req.query['movieName']
    const url = `http://www.omdbapi.com/?apikey=${process.env.apikey}&s=${movieName}}`;
    request(url, function(error, response, body) {
        if(!error && response.statusCode==200) {
            const data = JSON.parse(body)
            if(data.Response == 'False') {
                res.send("NOT FOUND")
            }
            else {
                res.render("result.ejs",{movieData: data})
            }
        }
        else {
            console.log(error)
            res.send("Error")
        }
    }) 
});
app.get('/result/:id', (req, res)=>{
    movieID = req.params.id
    const url = `http://www.omdbapi.com/?apikey=${process.env.apikey}&i=${movieID}`;
    request(url, function(error, response, body) {
        if(!error && response.statusCode==200) {
            const data = JSON.parse(body)
            if(data.Response == 'False') {
                res.send("NOT FOUND")
            }
            else {
                res.render("movie.ejs",{movieData: data})
            }
        }
        else {
            console.log(error)
            res.send("Error")
        }
    })
});

app.get('/aboutme', (req,res)=> {
    res.render("aboutme.ejs")
})

app.get('/login',(req,res)=> {
    // console.log("Hi")
    res.render("login.ejs")
})

app.post('/login', (req,res)=> {
    const email = req.body.email;
    const password = req.body.password;

    const Credentials = mongoose.model("Credentials", UserSchema)

    var query = {email: email, password: password}

    db.collection("credentials").find(query).toArray(function(err, result) {  
        // if (err) throw err;  
        len = result.length
        if(len == 0) {
            res.send("Invalid Credentials")
        }
        else {
            res.send("Logged In Succesfully")
        }
        db.close();  
    });  

})

app.get('/register', (req,res)=> {
    res.render('register.ejs')
})
app.post('/register', (req,res)=> {
    try {
        const fullname = req.body.fullname;
        const email = req.body.email;
        const age = req.body.age;
        const password = req.body.password;

        const Credentials = mongoose.model("Credentials", UserSchema)

        var person = new Credentials(req.body)
        person.save();
        res.send("Saved")

    } catch (error) {
        res.status(400).send("Invalid Details")
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server is Starting...\n".brightGreen.bold)
})