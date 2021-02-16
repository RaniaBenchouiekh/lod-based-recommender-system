var exports = module.exports={};
var MoviesFetcherRating = require('./MoviesFetcherRating.js')
const Papa = require('papaparse');
const fs = require('fs');

const csvFileProps = fs.readFileSync('./CSVFiles/Movies/props.csv') 
const csvProps = csvFileProps.toString() 
const csvDataProps = Papa.parse(csvProps, {header:true}).data

exports.getExctractedMoviesURI = async function (ProfileMovies, ProfileBooks, genreBooks, genreMovies){
    var genres = []

    await ProfileMovies.map((movie)=>{
        // ex. movie.filmGenre = "genre1, genre2, .."
        var gnr = movie.filmGenre.split(',') 
        gnr.map((g)=>{
            if(g !== '' && g !== 'none' && g !== ' ') genres.push(g);
        })
    }) 

    await ProfileBooks.map((book)=>{
        if(book.literaryGenre !== '' && book.literaryGenre !== 'none' && book.literaryGenre !== ' ') genres.push(book.literaryGenre);
    })

    await genreMovies.map((gm)=>{
        genres.push(gm)
    })

    await genreBooks.map((gb)=>{
        if(gb.toLowerCase()==='tragedy') genres.push('action')

        if(gb.toLowerCase()==='adventure') genres.push('adventure')

        if(gb.toLowerCase()==='children' || gb.toLowerCase()==='manga') genres.push("animation")
        
        if(gb.toLowerCase()==='humor' || gb.toLowerCase()==='comedy') genres.push('comedy')

        if(gb.toLowerCase()==='crime') genres.push('crime')
            
        if(gb.toLowerCase()==='biography'
            || gb.toLowerCase()==='philosophy' || gb.toLowerCase()==='psycology' || gb.toLowerCase()==='journalism' || gb.toLowerCase()==='essay' 
            || gb.toLowerCase()==='memoir' || gb.toLowerCase()==='mathematical' || gb.toLowerCase()==='law' || gb.toLowerCase()==='letter')
            genres.push('documentary')
        
        if(gb.toLowerCase()==='classics') genres.push('drama')

        if(gb.toLowerCase()==='cookbooks' || gb.toLowerCase()==='education')
            genres.push('family')

        if(gb.toLowerCase()==='art' || gb.toLowerCase()==='music' || gb.toLowerCase()==='poetry') genres.push('music')

        if(gb.toLowerCase()==='horror') genres.push('horror')

        if(gb.toLowerCase()==='historicalfiction' || gb.toLowerCase()==='history' || gb.toLowerCase()==='legend') genres.push('history')

        if(gb.toLowerCase()==='fantasy') genres.push('fantasy')

        if(gb.toLowerCase()==='mystery' || gb.toLowerCase()==='paranormal') genres.push('mystery')

        if(gb.toLowerCase()==='romance') genres.push('romance')

        if(gb.toLowerCase()==='fiction'  || gb.toLowerCase()==='science') genres.push('sciencefiction') 

        if(gb.toLowerCase()==='suspencethriller') genres.push('thriller')

        if(gb.toLowerCase()==='tragedy') genres.push('war')

        if(gb.toLowerCase()==='western') genres.push('western')
    })    

    var cleanGenres = await genres.filter((v,i) => genres.indexOf(v) === i)

    console.log("cleanGenres : " + cleanGenres)

    var moviesByGenres = await MoviesFetcherRating.fetchMoviesByGenre(cleanGenres.join(','))
    var movies = moviesByGenres

    ExtURIs = []
    for (let i = 0; i < movies.length; i++) {
        var resource = await extractMovieURIFromCSV(movies[i].title)
        var URI = resource.uri
        var movie = {
            "uri" : URI,
            "id" : movies[i].id,
            "title": movies[i].title !== "none" ? movies[i].title : resource.title,
            "tagline": movies[i].tagline !== "none" ? movies[i].tagline : resource.tagline,
            "overview": movies[i].overview !== "none" ? movies[i].overview : resource.overview,
            "production_companies": movies[i].production_companies !== "none" ? movies[i].production_companies : resource.production_companies,
            "release_date": movies[i].release_date !== "none" ? movies[i].release_date : resource.release_date,
            "genres": movies[i].genres !== "none" ? movies[i].genres : resource.genres, 
            "spoken_languages": movies[i].spoken_languages !== "none" ? resource.spoken_languages : movies[i].spoken_languages, 
            "runtime": movies[i].runtime !== "none" ? movies[i].runtime : resource.runtime, 
            "poster_path": movies[i].poster_path,
            "homepage": movies[i].homepage,
            "provider": "TMDB",
            "vote_average": movies[i].vote_average
        }
        if(URI!==undefined && URI!=='') ExtURIs.push(movie)
    }
    return ExtURIs
}

exports.getFavoriteMoviesURI = async function (ProfileMovies){
    FavURIs = []
    for (let i = 0; i < ProfileMovies.length; i++) {
        var resource = await extractMovieURIFromCSV(ProfileMovies[i].title)
        var URI = resource.uri
        if(URI!==undefined && URI!=='' ) FavURIs.push(URI)
    }
    return FavURIs
}

function unifyVar(prop) {
    return prop.split(' ').join('_').toLowerCase()
}

async function extractMovieURIFromCSV(title) {
    
    let resource = {}

    var movie = await csvDataProps.filter(data => ( ( unifyVar(data.title+'').includes(unifyVar(title+'')) || unifyVar(title+'').includes(unifyVar(data.title+'')) )  
                                         ))[0]
    if(movie!==undefined)
        resource = {
            "uri" : movie.resource,
            "title": movie.title, 
            "tagline": movie.tagline, 
            "overview": movie.overview, 
            "production_companies": movie.production_companies,
            "release_date": movie.release_date, 
            "genres": movie.genres,
            "spoken_languages": movie.spoken_languages,
            "runtime": movie.runtime
        }

    return resource
}


exports.cleanObjects = async function removeDuplicates(movies) { 

    let newArray = []; 
    let uniqueObject = {}; 
      
    // Loop for the array elements 
    for (let i in movies) { 
        objTitle = movies[i]['uri']; 
        uniqueObject[objTitle] = movies[i]; 
    } 
      
    // Loop to push unique object into array 
    for (i in uniqueObject) { 
        newArray.push(uniqueObject[i]); 
    } 
      
    return newArray; 
} 