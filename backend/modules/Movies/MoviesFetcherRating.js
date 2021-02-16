var exports = module.exports={};
const mod = require('./moviesFetchMethods')

exports.fetchMoviesByGenre= async function(genres) {
    var Movies,i
    var movieTable = [],tab = []
    tab = genres.split(",")

    for(i=0;i<tab.length;i++) {
        Movies = await mod.getJsonFileGenres(tab[i]) 
        movieTable = movieTable.concat(Movies.moviesResults)
    }
    
    return movieTable;
}