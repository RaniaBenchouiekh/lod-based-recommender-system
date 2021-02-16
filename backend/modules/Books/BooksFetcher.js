var exports = module.exports={};

const mod = require('./fetchMethods')

exports.fetchBooksByAuthor= async function(authors, providers) {
    var Books,i
    var bookTable = [],tab = []
    tab = authors.split(",")

    for(i=0;i<tab.length;i++) {
        Books = await mod.getJsonFileAuthors(tab[i], providers) 
        bookTable = bookTable.concat(Books.booksResults)
    }
    
    var js={"booksResults" : bookTable}
    js.booksResults.sort((a, b)=> {  
        if (a["rating"] > b["rating"]) {  
            return -1;  
        } else 
            if (a["rating"] < b["rating"])
            return 1; 
    })
    return js;
}