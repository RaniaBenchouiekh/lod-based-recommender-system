var express = require('express');
var router = express.Router();
var RSB = require('../modules/Books/RSAlgoBooks.js');
var RSM = require('../modules/Movies/RSAlgoMovies.js');
var URIExtractBooks = require('../modules/Books/URIExtractBooks.js')
var URIExtractMovies = require('../modules/Movies/URIExtractMovies.js')

/**BOOKS LODS */

router.post('/books', async function(req, res) {
    var ExtURIs = await URIExtractBooks.getExctractedBooksURI(req.body.profileBooks, req.body.profileMovies, req.body.genreBooks, req.body.genreMovies)
    var ext = await URIExtractBooks.cleanObjects(ExtURIs)
    console.log('ExtURIs => ' + ext)
    
    var FavURIs = await URIExtractBooks.getFavoriteBooksURI(req.body.profileBooks)
    var fav = FavURIs
    console.log('FavURIs => ' + fav)
    
    let lodsScores = await RSB.LODS(fav, ext).then((result)=>{
        console.log("\nLODS books = ")
        result.map((book)=>{console.log(book)})
        return result
    })

    res.setHeader('Content-Type', 'application/json');
    res.send({ data: lodsScores })
});

/**MOVIES LODS */

router.post('/movies', async function(req, res) {
    var ExtURIs = await URIExtractMovies.getExctractedMoviesURI(req.body.profileMovies, req.body.profileBooks, req.body.genreBooks, req.body.genreMovies)
    var ext = await URIExtractMovies.cleanObjects(ExtURIs)
    console.log('ExtURIs => ' + ext)
    
    var FavURIs = await URIExtractMovies.getFavoriteMoviesURI(req.body.profileMovies)
    var fav = FavURIs
    console.log('FavURIs => ' + fav)
    
    let lodsScores = await RSM.LODS(fav, ext).then((result)=>{
        //console.log("\nLODS movies = ")
        //result.map((movie)=>{console.log(movie)})
        return result
    })

    res.setHeader('Content-Type', 'application/json');
    res.send({ data: lodsScores })
});

module.exports = router;