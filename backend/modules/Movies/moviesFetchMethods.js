var exports = module.exports={};
var fetch = require('node-fetch');
var convert = require('xml-js');

const genresIds = [{"id":28,"name":"action"},{"id":12,"name":"adventure"},{"id":16,"name":"animation"},{"id":35,"name":"comedy"},
{"id":80,"name":"crime"},{"id":99,"name":"documentary"},{"id":18,"name":"drama"},{"id":10751,"name":"family"},{"id":14,"name":"fantasy"},
{"id":36,"name":"history"},{"id":27,"name":"horror"},{"id":10402,"name":"music"},{"id":9648,"name":"mystery"},{"id":10749,"name":"romance"},
{"id":878,"name":"scienceFiction"},{"id":53,"name":"thriller"},{"id":10752,"name":"war"},{"id":37,"name":"western"}]

//FETCHING ___________________________________________________________________________
    //Fetch in TMDB by genre
     async function getMovieGenres (genre) {
        let genreId
        genresIds.map((g)=>{
            if(g.name===genre) { genreId=g.id }
        })
        let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=9c2c8a8d8c8e56408d65cb138344b132&with_genres=${genreId}&sort_by=vote_average.desc`)
                            .then(response => response.json())
                            .then( json => { return(json.results) })
                            .catch(error => { console.log('Error : Error in fetching by genre\nProvider : TMDB'); });
        return data
    }
  
    //Fetch in TMDB by keyword
    async function getMovieKeyword (keyword, page) {
        page = page || 1
        let data = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=9c2c8a8d8c8e56408d65cb138344b132&query=${keyword}&sort_by=vote_average.desc&page=${page}`)
                            .then(response => response.json())
                            .then( json => {  return(json)  })
                            .catch(error => { console.log('Error : Error in fetching by keyword\nProvider : TMDB'); });
        return data
    }

//CREATING THE JSON FILE ___________________________________________________________________________

exports.getJsonFileGenres= async function(attribute){
    //Create a new json object
    var Movies = {"moviesResults":[]}  

        
    //Create the TMDB json file
    data = await getMovieGenres(attribute)

    if(data!==undefined || data.length!==0)
    {
        var len = data.length
        if(len>10) len=10
        for (let i = 0; i < len; i++) {
            let details = await fetch(`https://api.themoviedb.org/3/movie/${data[i].id}?api_key=9c2c8a8d8c8e56408d65cb138344b132`)
                                    .then(response => response.text())
                                    .then(json => { 
                                        var js = json
                                        if (js.length !== 0 ) return(JSON.parse(js))
                                    }) 
            .catch(error => {  console.log('Error : Error in fetching book details\nProvider : TMDB');});
            if(details!==undefined){
                Movie = {
                    "id": data[i].id === null || data[i].id === undefined ? "none" : data[i].id,
                    "title": details.title === null || details.title === undefined ? "none" : details.title, 
                    "tagline": details.tagline === "" || details.tagline === undefined ? "none" : details.tagline, 
                    "overview": details.overview === "No Overview" || details.overview === "Plot unknown" || details.overview === undefined ? "none" : details.overview,
                    "production_companies": details.production_companies === [ ] || details.production_companies===undefined ? "none" : details.production_companies, 
                    "release_date": details.release_date === "" ||details.release_date===undefined ? "none" : details.release_date, 
                    "genres": details.genres === [ ] || details.genres===undefined ? "none" : details.genres, 
                    "spoken_languages": details.spoken_languages === [ ] || details.spoken_languages === 'No Languages' || details.spoken_languages===undefined || details.spoken_languages==='' ? "none" : details.spoken_languages, 
                    "runtime": details.runtime === null || details.runtime===undefined ? "none" : details.runtime,
                    "poster_path": details.poster_path === null || details.poster_path===undefined ? "http://localhost:3002/movie.png" : "http://image.tmdb.org/t/p/w185/"+details.poster_path,
                    "homepage": details.homepage === null || details.homepage===undefined || details.homepage==='' ? "https://www.themoviedb.org/movie/"+data[i].id : details.homepage,
                    "provider": "TMDB",
                    "vote_average": details.vote_average === undefined ? "none" : details.vote_average
                }
                Movies.moviesResults.push(Movie);
            }
        }
    
    }

    return Movies
}
     
exports.getJsonFileKeyword= async function(attribute, page){
    //Create a new json object
    var Movies = {"moviesResults":[]}  

        
    //Create the TMDB json file
    var d = await getMovieKeyword(attribute, page)
    var data = d.results

    if(data!==undefined)
    {
        var len = data.length
        for (let i = 0; i < len; i++) {
            let details = await fetch(`https://api.themoviedb.org/3/movie/${data[i].id}?api_key=9c2c8a8d8c8e56408d65cb138344b132`)
                                    .then(response => response.text())
                                    .then(json => { 
                                        var js = json
                                        if (js.length !== 0 ) return(JSON.parse(js))
                                    }) 
            .catch(error => {  console.log('Error : Error in fetching book details\nProvider : TMDB');});
            if(details!==undefined){
                Movie = {
                    "id": data[i].id === null || data[i].id === undefined ? "none" : data[i].id,
                    "title": details.title === null || details.title === undefined ? "none" : details.title, 
                    "tagline": details.tagline === "" || details.tagline === undefined ? "none" : details.tagline, 
                    "overview": details.overview === "No Overview" || details.overview === "Plot unknown" || details.overview === undefined ? "none" : details.overview,
                    "production_companies": details.production_companies === [ ] || details.production_companies===undefined ? "none" : details.production_companies, 
                    "release_date": details.release_date === "" ||details.release_date===undefined ? "none" : details.release_date, 
                    "genres": details.genres === [ ] || details.genres===undefined ? "none" : details.genres, 
                    "spoken_languages": details.spoken_languages === [ ] || details.spoken_languages === 'No Languages' || details.spoken_languages===undefined || details.spoken_languages==='' ? "none" : details.spoken_languages, 
                    "runtime": details.runtime === null || details.runtime===undefined ? "none" : details.runtime,
                    "poster_path": details.poster_path === null || details.poster_path===undefined ? "http://localhost:3002/movie.png" : "http://image.tmdb.org/t/p/w185/"+details.poster_path,
                    "homepage": details.homepage === null || details.homepage===undefined || details.homepage==='' ? "https://www.themoviedb.org/movie/"+data[i].id : details.homepage,
                    "provider": "TMDB",
                    "vote_average": details.vote_average === undefined ? "none" : details.vote_average,
                    "total_pages": d.total_pages===undefined ? "none" : d.total_pages
                }
                Movies.moviesResults.push(Movie);
            }
        }
    }

    return Movies
}
    
    exports.rankingSorter = function (firstKey/*,secondKey*/) {
    return function(a, b) {  
        if (a[firstKey] > b[firstKey]) {  
            return -1;  
        } else if (a[firstKey] < b[firstKey]) {  
            return 1;  
        }  
        else return 0;
/*        else {
            if (a[secondKey] > b[secondKey]) {  
                return 1;  
            } else if (a[secondKey] < b[secondKey]) {  
                return -1;  
            } else {
                return 0;
            }
        } */
    }  
}