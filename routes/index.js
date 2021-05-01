const express = require('express');
const request = require('request');
const router = express.Router()
require('dotenv').config()  

router.get('/', (req, res)=> {
    res.render('homepage.ejs')
})  

router.get('/aboutme', (req,res)=>{
    res.render('aboutme.ejs')
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

module.exports = router