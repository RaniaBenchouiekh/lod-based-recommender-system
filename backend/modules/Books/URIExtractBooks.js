var exports = module.exports={};
var BooksFetcherRating = require('./BooksFetcherRating.js')
var BooksFetcher = require('./BooksFetcher.js')
const Papa = require('papaparse');
const fs = require('fs');

const csvFileProps = fs.readFileSync('./CSVFiles/Books/props.csv')
const csvProps = csvFileProps.toString() 
const csvDataProps = Papa.parse(csvProps, {header:true}).data

exports.getExctractedBooksURI = async function (ProfileBooks, ProfileMovies, genreBooks, genreMovies){
    var genres = [], authors = []

    await ProfileBooks.map((book)=>{
        if(book.literaryGenre !== '' && book.literaryGenre !== 'none' && book.literaryGenre !== ' ') genres.push(book.literaryGenre);
        if(book.author !== '' && book.author !== 'none' && book.author !== ' ') authors.push(book.author);
    }) 

    await ProfileMovies.map((movie)=>{
        if(movie.filmGenre !== '' && movie.filmGenre !== 'none' && movie.filmGenre !== ' ') genres.push(movie.filmGenre);
        if(movie.title !== '' && movie.title !== 'none' && movie.title !== ' ') genres.push(movie.title);
    }) 

    await genreBooks.map((gb)=>{
        genres.push(gb);    
    })

    await genreMovies.map((gm)=>{
        genres.push(gm);
    })


    var cleanGenres = await genres.filter((v,i) => genres.indexOf(v) === i)
    var cleanAuthors = await authors.filter((v,i) => authors.indexOf(v) === i)

    console.log("cleanGenres : " + cleanGenres)

    var booksByGenres = await BooksFetcherRating.fetchBooksByGenre(cleanGenres.join(','))
    var booksByAuthors = await BooksFetcher.fetchBooksByAuthor(cleanAuthors.join(','))
    var books = booksByGenres.booksResults.concat(booksByAuthors.booksResults)

    ExtURIs = []
    for (let i = 0; i < books.length; i++) {
        var resource = await extractBookURIFromCSV(books[i].title, books[i].authors)
        var URI = resource.uri
        var book = {
            "uri" : URI,
            "id" : books[i].id,
            "isbn13": books[i].isbn13,
            "title": books[i].title !== "none" ? books[i].title : resource.title,
            "subtitle": books[i].subtitle,
            "abstract": books[i].abstract !== "none" ? books[i].abstract : resource.abstract,
            "authors": books[i].authors !== "none" ? books[i].authors : resource.authors,
            "publisher": books[i].publisher !== "none" ? books[i].publisher : resource.publisher,
            "published": books[i].published !== "none" ? books[i].published : resource.published,
            "genres": books[i].genres !== "none" ? books[i].genres : resource.genres, 
            "language": books[i].language !== "none" ? resource.language : books[i].language, 
            "pages": books[i].pages !== "none" ? books[i].pages : resource.pages, 
            "image": books[i].image,
            "link": books[i].link,
            "provider": books[i].provider,
            "rating": books[i].rating,
            "country": resource.country !== "none" ? resource.country : "none",
            "series": resource.series !== "none" ? resource.series : "none"
        }
        if(URI!==undefined && URI!=='') ExtURIs.push(book)
    }
    return ExtURIs
}

exports.getFavoriteBooksURI = async function (ProfileBooks){
    FavURIs = []
    for (let i = 0; i < ProfileBooks.length; i++) {
        var resource = await extractBookURIFromCSV(ProfileBooks[i].title, ProfileBooks[i].author)
        var URI = resource.uri
        if(URI!==undefined && URI!=='' ) FavURIs.push(URI)
    }
    return FavURIs
}

function unifyVar(prop) {
    return prop.split(' ').join('_').toLowerCase()
}

async function extractBookURIFromCSV(title, author) {
    
    let resource = {}

    var book = await csvDataProps.filter(data => ( ( unifyVar(data.title+'').includes(unifyVar(title+'')) || unifyVar(title+'').includes(unifyVar(data.title+'')) )  
                                                    &&
                                                   ( unifyVar(data.author+'').includes(unifyVar(author+'')) || unifyVar(author+'').includes(unifyVar(data.author+'')) )
                                        ))[0]
    if(book!==undefined)
        resource = {
            "uri" : book.resource,
            "title": book.title, 
            "abstract": book.abstract, 
            "authors": book.author,
            "publisher": book.publisher,
            "published": book.releaseDate, 
            "genres": book.genre,
            "language": book.language,
            "pages": book.pages,
            "country": book.country,
            "series": book.series
        }

    return resource
}


exports.cleanObjects = async function removeDuplicates(books) { 

    let newArray = []; 
    let uniqueObject = {}; 
      
    // Loop for the array elements 
    for (let i in books) { 
        objTitle = books[i]['uri']; 
        uniqueObject[objTitle] = books[i]; 
    } 
      
    // Loop to push unique object into array 
    for (i in uniqueObject) { 
        newArray.push(uniqueObject[i]); 
    } 
      
    return newArray; 
} 