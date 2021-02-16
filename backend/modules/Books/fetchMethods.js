var exports = module.exports={};
var fetch = require('node-fetch');
var convert = require('xml-js');

const APIKEY = 'AIzaSyDeUA5KYqJRpGqxVHpzHqAbmWPuHfHQL0o'

//FETCHING ___________________________________________________________________________
    //Fetch in Google Books by genre
     async function getGoogleBooksGenres (genre) {
        let data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${genre}&key=${APIKEY}&maxResults=15`)
                            .then(response => response.json())
                            .then( json => {  return(json.items)  })
                            .catch(error => { console.log('Error : Error in fetching\nProvider : Google Books'); });
        return data
    }

    //Fetch in Google Books by author
     async function getGoogleBooksAuthors (author) {
        let data = await fetch(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&key=${APIKEY}&maxResults=15`)
                            .then(response => response.json())
                            .then( json => {  return(json.items)  })
                            .catch(error => { console.log('Error : Error in fetching\nProvider : Google Books'); });
        return data
    }

    //Fetch in Goodreads by genres/author
     async function getGoodreads(attribute) {
        let data = await fetch(`https://www.goodreads.com/search/index.xml?q=${attribute}&key=uKqSyne5PnNmp9mI2srCg`)
                            .then(response => response.text())
                            .then(xml => {  
                                var js = convert.xml2json(xml, {compact: true, spaces: 4});
                                var js2 = JSON.parse(js).GoodreadsResponse
                                if (js2 !==undefined ) return(js2.search.results.work)
                            })
                            .catch(error => { console.log('Error : Error in fetching\nProvider : Goodreads'); }); 
        return data
    }

    //Fetch in itBooks by genre/author
    async function getItBooks(attribute) {
        let data = await fetch(`https://api.itbook.store/1.0/search/${attribute}`)
                            .then(response => response.text())
                            .then(json => { 
                                var js = json
                                if (js.length !== 0 ) return(JSON.parse(js).books)
                            })  
                            .catch(error => { console.log('Error : Error in fetching\nProvider : itBooks');});
        return data
    }

//CREATING THE JSON FILE ___________________________________________________________________________

 exports.getJsonFileGenres= async function(attribute, providers=[true, true, true]){
    //Create a new json object
    var Books = {"booksResults":[]}  

    //Create the Google Books json file
    if(providers[0]){
        let data = await getGoogleBooksGenres(attribute)
        if(data!==undefined)
            for (let i = 0; i < data.length; i++) {
                Book = {
                    "id": data[i].volumeInfo.infoLink,
                    "isbn13": data[i].volumeInfo.industryIdentifiers===undefined || data[i].volumeInfo.industryIdentifiers[1]===undefined ? "none" : data[i].volumeInfo.industryIdentifiers[1].identifier,
                    "title": data[i].volumeInfo.title,
                    "subtitle": data[i].volumeInfo.subtitle === undefined ? "none" : data[i].volumeInfo.subtitle,
                    "abstract": data[i].volumeInfo.description === undefined ? "none" : data[i].volumeInfo.description,
                    "authors": data[i].volumeInfo.authors === undefined ? "none" : data[i].volumeInfo.authors,
                    "publisher": data[i].volumeInfo.publisher === undefined ? "none" : data[i].volumeInfo.publisher, 
                    "published": data[i].volumeInfo.publishedDate === undefined ? "none" : data[i].volumeInfo.publishedDate, 
                    "genres": data[i].volumeInfo.categories === undefined ? "none" : data[i].volumeInfo.categories,
                    "language": data[i].volumeInfo.language === undefined ? "none" : data[i].volumeInfo.language,
                    "pages": data[i].volumeInfo.pageCount === undefined ? "none" : data[i].volumeInfo.pageCount,
                    "image": data[i].volumeInfo.imageLinks ===undefined ? "none" : data[i].volumeInfo.imageLinks.thumbnail,
                    "link": data[i].volumeInfo.infoLink === undefined ? "none" : data[i].volumeInfo.infoLink,
                    "provider": "Google Books",
                    "rating": data[i].volumeInfo.averageRating===undefined ? 0 : data[i].volumeInfo.averageRating
                }
                Books.booksResults.push(Book);
            }
    }
    /*
    //Create the Goodreads json file
    if(providers[1]){
        data = await getGoodreads(attribute)
        if(data!==undefined)
            for (let i = 0; i < data.length; i++) {
                Book = {
                    "id": data[i].id._text === undefined ? "none" : data[i].id._text,
                    "isbn13": "none",
                    "title": data[i].best_book.title._text  === undefined ? "none" : data[i].best_book.title._text, 
                    "subtitle": "none", 
                    "abstract": "none",
                    "authors": data[i].best_book.author.name._text === undefined ? "none" : data[i].best_book.author.name._text, 
                    "publisher": "none",
                    "published": data[i].original_publication_year._text === undefined ? "none" : data[i].original_publication_year._text, 
                    "genres": "none",
                    "language": "none",
                    "pages": "none",
                    "image": data[i].best_book.image_url._text === undefined ? "none" : data[i].best_book.image_url._text,
                    "link": "https://www.goodreads.com/book/title?id="+data[i].best_book.title._text,
                    "provider": "Goodreads",
                    "rating": data[i].average_rating._text===undefined ? 0 : data[i].average_rating._text
                }
                Books.booksResults.push(Book);
            }
    }
        
    //Create the itBooks json file
    if(providers[2]){
        data = await getItBooks(attribute)
        if(data!==undefined)
        {
            var len = data.length
            if(len>3) len = 3
            for (let i = 0; i < len; i++) {
                let details = await fetch(`https://api.itbook.store/1.0/books/${data[i].isbn13}`)
                                        .then(response => response.text())
                                        .then(json => { 
                                            var js = json
                                            if (js.length !== 0 ) return(JSON.parse(js))
                                        }) 
                .catch(error => {  console.log('Error : Error in fetching book details\nProvider : itBooks');});
                if(details!==undefined){
                    Book = {
                        "id": data[i].isbn13 === undefined ? "none" : data[i].isbn13,
                        "isbn13": data[i].isbn13 === undefined ? "none" : data[i].isbn13,
                        "title": details.title === undefined ? "none" : details.title, 
                        "subtitle": details.subtitle === undefined ? "none" : details.subtitle, 
                        "abstract": details.desc === undefined ? "none" : details.desc,
                        "authors": details.authors === undefined ? "none" : details.authors, 
                        "publisher": details.publisher === undefined ? "none" : details.publisher,
                        "published": details.year === undefined ? "none" : details.year, 
                        "genres": ["IT Books"],
                        "language": "en",
                        "pages": details.pages === undefined ? "none" : details.pages,
                        "image": details.image ===undefined ? "none" : details.image,
                        "link": details.url === undefined ? "none" : details.url,
                        "provider": "IT Books",
                        "rating": details.rating===undefined ? 0 : details.rating
                    }
                    Books.booksResults.push(Book);
                }
            }
        }
    }*/

    return Books
}
     
    exports.getJsonFileAuthors= async function(attribute, providers=[true, true, true]){
        //Create a new json object
        var Books = {"booksResults":[]}  

        //Create the Google Books json file
        if(providers[0]){
            let data = await getGoogleBooksAuthors(attribute)
            if(data!==undefined)
                for (let i = 0; i < data.length; i++) {
                    Book = {
                        "id": data[i].volumeInfo.infoLink,
                        "isbn13": data[i].volumeInfo.industryIdentifiers===undefined || data[i].volumeInfo.industryIdentifiers[1]===undefined ? "none" : data[i].volumeInfo.industryIdentifiers[1].identifier,
                        "title": data[i].volumeInfo.title,
                        "subtitle": data[i].volumeInfo.subtitle === undefined ? "none" : data[i].volumeInfo.subtitle,
                        "abstract": data[i].volumeInfo.description === undefined ? "none" : data[i].volumeInfo.description,
                        "authors": data[i].volumeInfo.authors === undefined ? "none" : data[i].volumeInfo.authors,
                        "publisher": data[i].volumeInfo.publisher === undefined ? "none" : data[i].volumeInfo.publisher, 
                        "published": data[i].volumeInfo.publishedDate === undefined ? "none" : data[i].volumeInfo.publishedDate, 
                        "genres": data[i].volumeInfo.categories === undefined ? "none" : data[i].volumeInfo.categories,
                        "language": data[i].volumeInfo.language === undefined ? "none" : data[i].volumeInfo.language,
                        "pages": data[i].volumeInfo.pageCount === undefined ? "none" : data[i].volumeInfo.pageCount,
                        "image": data[i].volumeInfo.imageLinks ===undefined ? "none" : data[i].volumeInfo.imageLinks.thumbnail,
                        "link": data[i].volumeInfo.infoLink === undefined ? "none" : data[i].volumeInfo.infoLink,
                        "provider": "Google Books",
                        "rating": data[i].volumeInfo.averageRating===undefined ? 0 : data[i].volumeInfo.averageRating
                    }
                    Books.booksResults.push(Book);
                }
        }
        /*
        //Create the Goodreads json file
        if(providers[1]){
            data = await getGoodreads(attribute)
            if(data!==undefined)
                for (let i = 0; i < data.length; i++) {
                    Book = {
                        "id": data[i].id._text === undefined ? "none" : data[i].id._text,
                        "isbn13": "none",
                        "title": data[i].best_book.title._text  === undefined ? "none" : data[i].best_book.title._text, 
                        "subtitle": "none", 
                        "abstract": "none",
                        "authors": data[i].best_book.author.name._text === undefined ? "none" : data[i].best_book.author.name._text, 
                        "publisher": "none",
                        "published": data[i].original_publication_year._text === undefined ? "none" : data[i].original_publication_year._text, 
                        "genres": "none",
                        "language": "none",
                        "pages": "none",
                        "image": data[i].best_book.image_url._text === undefined ? "none" : data[i].best_book.image_url._text,
                        "link": "https://www.goodreads.com/book/title?id="+data[i].best_book.title._text,
                        "provider": "Goodreads",
                        "rating": data[i].average_rating._text===undefined ? 0 : data[i].average_rating._text
                    }
                    Books.booksResults.push(Book);
                }
        }
            
        //Create the itBooks json file
        if(providers[2]){
            data = await getItBooks(attribute)
            if(data!==undefined)
            {
                var len = data.length
                if(len>3) len = 3
                for (let i = 0; i < len; i++) {
                    let details = await fetch(`https://api.itbook.store/1.0/books/${data[i].isbn13}`)
                                            .then(response => response.text())
                                            .then(json => { 
                                                var js = json
                                                if (js.length !== 0 ) return(JSON.parse(js))
                                            }) 
                    .catch(error => {  console.log('Error : Error in fetching book details\nProvider : itBooks');});
                    if(details!==undefined){
                        Book = {
                            "id": data[i].isbn13 === undefined ? "none" : data[i].isbn13,
                            "isbn13": data[i].isbn13 === undefined ? "none" : data[i].isbn13,
                            "title": details.title === undefined ? "none" : details.title, 
                            "subtitle": details.subtitle === undefined ? "none" : details.subtitle, 
                            "abstract": details.desc === undefined ? "none" : details.desc,
                            "authors": details.authors === undefined ? "none" : details.authors, 
                            "publisher": details.publisher === undefined ? "none" : details.publisher,
                            "published": details.year === undefined ? "none" : details.year, 
                            "genres": ["IT Books"],
                            "language": "en",
                            "pages": details.pages === undefined ? "none" : details.pages,
                            "image": details.image ===undefined ? "none" : details.image,
                            "link": details.url === undefined ? "none" : details.url,
                            "provider": "IT Books",
                            "rating": details.rating===undefined ? 0 : details.rating
                        }
                        Books.booksResults.push(Book);
                    }
                }
            }
        }
    */
        return Books
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