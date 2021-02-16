import * as fileClient from 'solid-file-client';
import * as rdfLib from 'rdflib'
import { createFolder, createSolidFile, appendSolidFile, replaceSolidFile, getUserCard, checkacess, removeSolidFile } from './solidMethods'
import SparqlClient from 'sparql-http-client';



//prefixes
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/')
const SBA = rdfLib.Namespace('http://w3id.org/SolidGoogleBooks/vocab/')
const DBR = rdfLib.Namespace('http://dbpedia.org/resource/')
const DBO = rdfLib.Namespace('http://dbpedia.org/ontology/')
const DBP = rdfLib.Namespace('http://dbpedia.org/property/')
const DBC = rdfLib.Namespace('http://dbpedia.org/resource/Category/')
const DCT = rdfLib.Namespace('http://purl.org/dc/terms/')
const SCHEMA = rdfLib.Namespace('http://schema.org/');
const VCARD = rdfLib.Namespace('http://www.w3.org/2006/vcard/ns#')

//constants
const MOH_SOLID_URI= "https://mohamed9600.solid.community/"
const MOH_INRUPT_URI= "https://mohamed79135.inrupt.net/"
const RANO_SOLID_URI="https://rania.solid.community/profil/card#me"


//export default class Communication extends Component {
    
    //exemple d'uri : https://rania.solid.community
    export async function createAppFolder(uri) {
        await createFolder(uri+'public/SolidGoogleBooks/');
    }
    export async function createSavedBooksFolder(uri) {
        await createFolder(uri+'public/SolidGoogleBooks/savedbooks/');
    }
    export async function createRatedBooksFolder(uri) {
        await createFolder(uri+'public/SolidGoogleBooks/ratedbooks/');
    }

    export async function createAppDataFile(uri) {
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidGoogleBooks/appdata.ttl');
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        graph.add(documentNN, RDF('type'), SBA('SolidGoogleBooksData'));
        graph.add(documentNN, SBA('performedConnexions'), 0);
        graph.add(documentNN, SBA('firstVisit'), new Date());
        var content = rdfLib.serialize(undefined, graph, 'appdata.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidGoogleBooks/', 'appdata.ttl', content);
    }

    export async function createInfoPersoFile(uri, fn, ln, email, birthday, gender) {
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidGoogleBooks/infoperso.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('PersonalProfileDocument'));
        graph.add(userUri, FOAF('firstName'), fn);
        graph.add(userUri, FOAF('lastName'), ln);
        graph.add(userUri, FOAF('OnlineAccount'), email);
        graph.add(userUri, FOAF('birthday'), birthday);
        graph.add(userUri, FOAF('gender'), gender); 
        var content = rdfLib.serialize(undefined, graph, 'infoperso.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidGoogleBooks/', 'infoperso.ttl', content);
    }

    export async function createGenresFile(uri,genres) {

        await removeSolidFile(uri+'public/SolidGoogleBooks/genres.ttl')

        let graph = rdfLib.graph()
        let documentNN = rdfLib.sym(uri+'/public/SolidGoogleBooks/genres.ttl')
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'))
        genres.map((genre) =>graph.add(userUri, FOAF('interest'), genre) )
        var content = rdfLib.serialize(undefined, graph, 'genres.ttl', 'text/turtle')
        await createSolidFile(uri+'/public/SolidGoogleBooks/', 'genres.ttl', content)
    }

    export async function readGenresFile(uri){
        let genresUrl = uri + '/public/SolidGoogleBooks/genres.ttl';

        let genres = await fileClient.readFile(genresUrl).then(genre => {
            let graph = rdfLib.graph();
            rdfLib.parse(genre, graph, genresUrl, "text/turtle");
            let blankNode = graph.any(undefined, FOAF('interest')); 
                     
            let genresTable = graph.any(blankNode, FOAF('interest'))===null ? "none" : graph.any(blankNode, FOAF('interest')).value

            const text = graph.toString();
            const regex = /\"(.*?)\"/gi;
            const resultMatchGroup = text.match(regex); // [ '[more or less]', '[more]', '[less]' ]
            const desiredRes = resultMatchGroup.map(match => match.replace(regex, "$1"))
            
            return desiredRes
        })

        return genres
    }

    export async function createRecommendersFile(uri, provider1, provider2, provider3) {

        await removeSolidFile(uri+'public/SolidGoogleBooks/recommenders.ttl')

        console.log("provider1, provider2, provider3 : " + provider1 + ", " + provider2 + ", " + provider3)
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidGoogleBooks/recommenders.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        if(provider1) graph.add(userUri, SBA('chooseProvider'), SBA('LODS_Recommender_System'));
        if(provider2) graph.add(userUri, SBA('chooseProvider'), SBA('SimC_Recommender_System'));
        if(provider3) graph.add(userUri, SBA('chooseProvider'), SBA('SimP_Recommender_System'));
        if(provider1) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'LODS_Recommender_System');
            graph.add(SBA('LODS_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SBA('LODS_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        if(provider2) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'SimC_Recommender_System');
            graph.add(SBA('SimC_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SBA('SimC_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        if(provider3) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'SimP_Recommender_System');
            graph.add(SBA('SimP_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SBA('SimP_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        var content = rdfLib.serialize(undefined, graph, 'recommenders.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidGoogleBooks/', 'recommenders.ttl', content);
    }

    export async function readRecommendersFile(uri){
        let recommendersUrl = uri + 'public/SolidGoogleBooks/recommenders.ttl';
        
        let RS = await fileClient.readFile(recommendersUrl).then(recommenders => {
            let graph = rdfLib.graph();
            rdfLib.parse(recommenders, graph, recommendersUrl, "text/turtle");
            let blankNode = graph.any(undefined, FOAF('name')); 
           
            //console.log(graph.any(blankNode, FOAF('name')))
            return (graph.any(blankNode, FOAF('name')))
        })

        return RS
    }

    export async function replaceRecommendersFile(uri, LODS, SimC, SimP) {
        let FileUrl = uri + '/public/SolidGoogleBooks/recommenders.ttl'
        let r = ''
        if(LODS) r = 'LODS_Recommender_System'
        else if(SimC) r = 'SimC_Recommender_System'
             else if(SimP) r = 'SimP_Recommender_System'
      
        replaceFile(FileUrl, 'recommenders.ttl', uri, SBA('chooseProvider'), r)
        replaceFile(FileUrl, 'recommenders.ttl', DBR('Recommender_system'), FOAF('name'), r)
        replaceFile(FileUrl, 'recommenders.ttl', r , RDF('type'), DBO('Website'))
        replaceFile(FileUrl, 'recommenders.ttl', r , DCT('subject'), DBC('Recommender_systems'))  
    }


    async function checkRatedBook(uri, title){
        var books = await readRatedBooks(uri,0).then( (result)=>{ return result })
        let arr = books.split("%%")
        let jsonArr = []
        for (let index = 1; index < arr.length; index++) {
            jsonArr.push(JSON.parse(arr[index]))
        }

        var t = false
        for (let i = 0; i < jsonArr.length; i++) 
            if(jsonArr[i].title===title) {t=true; break} 

        return t
    }

    async function checkSavedBook(uri, title){
        var books = await readSavedBooks(uri).then((result)=>{ return result })
        let arr = books.split("%%")
        let jsonArr = []
        for (let index = 1; index < arr.length; index++) {
            jsonArr.push(JSON.parse(arr[index]))
        }

        var t = false
        for (let i = 0; i < jsonArr.length; i++) 
            if(jsonArr[i].title===title) {t=true; break} 

        return t
    }

    export async function createSavedBooksFile(uri, ISBN, title, subtitle, abstract, numberOfPages, authors, language, releaseDate, literaryGenre, urlPhoto, provider, link) {
        //console.log(await checkSavedBook(uri, title))
        if(await checkSavedBook(uri, title)) {
            await removeSavedBook(uri, title.split(' ').join('_')+".ttl")
        }
        
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidGoogleBooks/savedbooks/'+ title +'.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        graph.add(documentNN, FOAF('primaryTopic'), DBO('Book'));
        if(ISBN !== undefined) graph.add(documentNN, DBO('ISBN'), ISBN);
        if(title !== undefined) graph.add(documentNN, DBP('title'), title);
        if(subtitle !== undefined) graph.add(documentNN, DBP('subtitle'), subtitle);

        if(authors !== undefined && typeof authors === "object")  
            for (let i = 0; i < authors.length; i++) { graph.add(documentNN, DBP('author'), authors[i]) }
        else 
            if(authors !== undefined && typeof authors === "string") graph.add(documentNN, DBP('author'), authors)    

        if(language !== undefined) graph.add(documentNN, DBP('language'), language);
        if(abstract !== undefined) graph.add(documentNN, DBO('abstract'), abstract);
        if(numberOfPages !== undefined) graph.add(documentNN, DBO('numberOfPages'), numberOfPages);
        if(releaseDate !== undefined) graph.add(documentNN, DBO('releaseDate'), releaseDate);

        if(literaryGenre !== undefined && typeof literaryGenre === "object") 
            for (let i = 0; i < literaryGenre.length; i++) { graph.add(documentNN, DBO('literaryGenre'), literaryGenre[i]) }
        else 
            if(literaryGenre !== undefined && typeof literaryGenre === "string") graph.add(documentNN, DBO('literaryGenre'), literaryGenre)    
        
        if(link !== undefined) graph.add(documentNN, DBR('Link'), link);
        if(urlPhoto !== undefined) graph.add(documentNN, FOAF('photo'), urlPhoto);
    
        graph.add(documentNN, DBO('source'), provider);
        graph.add(userUri, SBA('save'), documentNN);
        graph.add(userUri, SBA('saveDate'), new Date());

        var content = rdfLib.serialize(undefined, graph, title+'.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidGoogleBooks/savedbooks', title+'.ttl', content);
    }

    export async function createRatedBooksFile(uri, ratingValue, ISBN, title, subtitle, abstract, numberOfPages, authors, language, releaseDate, publisher, literaryGenre, urlPhoto, provider, link) {
        //console.log(await checkRatedBook(uri, title))
        if(await checkRatedBook(uri, title)) {
            await removeRatedBook(uri, title.split(' ').join('_')+".ttl")
        }
        
            let graph = rdfLib.graph();
            let documentNN = rdfLib.sym(uri+'public/SolidGoogleBooks/ratedbooks/'+ title +'.ttl');
            let userUri = rdfLib.sym(uri+'/profile/card#me')
            graph.add(documentNN, RDF('type'), FOAF('Document'));
            graph.add(documentNN, FOAF('primaryTopic'), DBO('Book'));
            if(ISBN !== undefined) graph.add(documentNN, DBO('ISBN'), ISBN);
            if(title !== undefined) graph.add(documentNN, DBP('title'), title);
            if(subtitle !== undefined) graph.add(documentNN, DBP('subtitle'), subtitle);

            if(authors !== undefined && typeof authors === "object")  
                for (let i = 0; i < authors.length; i++) { graph.add(documentNN, DBP('author'), authors[i]) }
            else 
                if(authors !== undefined && typeof authors === "string") graph.add(documentNN, DBP('author'), authors)

            if(publisher !== undefined) graph.add(documentNN, DBO('publisher'), publisher);
            if(language !== undefined) graph.add(documentNN, DBP('language'), language);
            if(abstract !== undefined) graph.add(documentNN, DBO('abstract'), abstract);
            if(numberOfPages !== undefined) graph.add(documentNN, DBO('numberOfPages'), numberOfPages);
            if(releaseDate !== undefined) graph.add(documentNN, DBO('releaseDate'), releaseDate);

            if(literaryGenre !== undefined && typeof literaryGenre === "object") 
                for (let i = 0; i < literaryGenre.length; i++) { graph.add(documentNN, DBO('literaryGenre'), literaryGenre[i]) }
            else 
                if(literaryGenre !== undefined && typeof literaryGenre === "string") graph.add(documentNN, DBO('literaryGenre'), literaryGenre)    
            
            if(link !== undefined) graph.add(documentNN, DBR('Link'), link);
            if(urlPhoto !== undefined) graph.add(documentNN, FOAF('photo'), urlPhoto);

            graph.add(documentNN, DBO('source'), provider);
            graph.add(documentNN, SCHEMA('bestRating'), "5");
            graph.add(documentNN, SCHEMA('ratingValue'), ratingValue);
            graph.add(documentNN, SCHEMA('worstRating'), "1");
            graph.add(userUri, SBA('rateDate'), new Date());
            graph.add(userUri, SBA('rate'), documentNN);

            var content = rdfLib.serialize(undefined, graph, title+'.ttl', 'text/turtle');

            await createSolidFile(uri+'public/SolidGoogleBooks/ratedbooks', title+'.ttl', content);
    }


    export async function appendInAppFile (FileUrl,subject,predicate,object) {
        let content  = 'INSERT DATA {'+subject+' '+predicate+' '+object+'}';
        appendSolidFile(FileUrl, content)
    }
    //ex : appendFile('https://raniaben.inrupt.net/public/rania/file5.ttl',RANO_SOLID_URI,predicate,object);

    export async function replaceFile(FileUrl,filePostLocation,subject,predicate,object){
        var fileContent = this.createContent(filePostLocation,subject,predicate,object)
        replaceSolidFile(FileUrl, fileContent)
    }
    //ex : replaceFile('https://raniaben.inrupt.net/public/rania/file5.ttl',"file5.ttl",MOH_SOLID_URI,"type","Document");

    //CheckAccess //uri avec profile/card#me
    export async function verifyAccess(uri){
        const webIdNN = rdfLib.sym(uri);
        let storeProfileCard = await getUserCard(webIdNN.uri);
        return(checkacess(storeProfileCard));
    }
    
    export function webidToUri (webId){
        var myRe = new RegExp('(.+)profile/card#me','i')
        var myArray = myRe.exec(webId);
        let uri = myArray[1]
        return uri
    }

    export async function readRatedBooks(uri, minRatingValue){
        let url = uri + '/public/SolidGoogleBooks/ratedbooks/';
            let booksRated=''
            
            let folder = await fileClient.readFolder( url, {links:"include"} )
            .then(value => {
                return value.files
            });

            for (let i = 0; i < await folder.length; i++) {
                   
                let f = fileClient.readFile(folder[i].url).then(ratedBook => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(ratedBook, graph, url, "text/turtle");
                    let blankNode = graph.any(undefined, DBP('title'));
                    let blankNode2 = graph.any(undefined, SBA('rateDate')); 

                    let book = {
                        "isbn" : graph.any(blankNode, DBO('ISBN'))===null ? "none" : graph.any(blankNode, DBO('ISBN')).value,
                        "title" : graph.any(blankNode, DBP('title'))===null ? "none" : graph.any(blankNode, DBP('title')).value,
                        "author" : graph.any(blankNode, DBP('author'))===null ? "none" : graph.any(blankNode, DBP('author')).value,
                        "publisher" : graph.any(blankNode, DBO('publisher'))===null ? "none" : graph.any(blankNode, DBO('publisher')).value,
                        "language" : graph.any(blankNode, DBP('language'))===null ? "none" : graph.any(blankNode, DBP('language')).value,
                        "abstract" : graph.any(blankNode, DBO('abstract'))===null ? "none" : graph.any(blankNode, DBO('abstract')).value,
                        "numberOfPages" : graph.any(blankNode, DBO('numberOfPages'))===null ? "none" : graph.any(blankNode, DBO('numberOfPages')).value,
                        "releaseDate" : graph.any(blankNode, DBO('releaseDate'))===null ? "none" : graph.any(blankNode, DBO('releaseDate')).value,
                        "literaryGenre" : graph.any(blankNode, DBO('literaryGenre'))===null ? "none" : graph.any(blankNode, DBO('literaryGenre')).value,
                        "link" : graph.any(blankNode, DBR('Link'))===null ? "none" : graph.any(blankNode, DBR('Link')).value,
                        "photo" : graph.any(blankNode, FOAF('photo'))===null ? "none" : graph.any(blankNode, FOAF('photo')).value,
                        "name" : graph.any(blankNode, FOAF('name'))===null ? "none" : graph.any(blankNode, FOAF('name')).value,
                        "source" : graph.any(blankNode, DBO('source'))===null ? "none" : graph.any(blankNode, DBO('source')).value,
                        "ratingValue" : graph.any(blankNode, SCHEMA('ratingValue'))===null ? "none" : graph.any(blankNode, SCHEMA('ratingValue')).value,
                        "rateDate" : graph.any(blankNode2, SBA('rateDate'))===null ? "none" : graph.any(blankNode2, SBA('rateDate')).value
                    }
                    return JSON.stringify(book)
                });
                booksRated=booksRated+"%%"+await f
            }
        return (booksRated)
    }

    export async function readInfoPerso(uri){
        let infoPersoUrl = uri + '/public/SolidGoogleBooks/infoperso.ttl';

        let infosPerso = await fileClient.readFile(infoPersoUrl).then(infoPerso => {
            let graph = rdfLib.graph();
            rdfLib.parse(infoPerso, graph, infoPersoUrl, "text/turtle");
            let blankNode = graph.any(undefined, FOAF('OnlineAccount')); 
                     
            let infos = {
                "email" : graph.any(blankNode, FOAF('OnlineAccount'))===null ? "none" : graph.any(blankNode, FOAF('OnlineAccount')).value,
                "firstName" : graph.any(blankNode, FOAF('firstName'))===null ? "none" : graph.any(blankNode, FOAF('firstName')).value,
                "lastName" : graph.any(blankNode, FOAF('lastName'))===null ? "none" : graph.any(blankNode, FOAF('lastName')).value,
                "birthday" : graph.any(blankNode, FOAF('birthday'))===null ? "none" : graph.any(blankNode, FOAF('birthday')).value,
                "gender" : graph.any(blankNode, FOAF('gender'))===null ? "none" : graph.any(blankNode, FOAF('gender')).value,
                "image" : ""
            }
            return infos
        })

        let cardUrl = uri + '/profile/card';

        let cardImage = await fileClient.readFile(cardUrl).then(card => {
            let graph = rdfLib.graph();
            rdfLib.parse(card, graph, cardUrl, "text/turtle");
            let blankNode = graph.any(undefined, FOAF('name')); 
            
            infosPerso.image = graph.any(blankNode, VCARD('hasPhoto'))===null ? "none" : graph.any(blankNode, VCARD('hasPhoto')).value
        })

        return infosPerso
    }

    export async function readSavedBooks(uri){
        let url = uri + '/public/SolidGoogleBooks/savedbooks/';
            let booksSaved = ''

            let folder = await fileClient.readFolder( url, {links:"include"} )
            .then(value => {
                return value.files
            });

            for (let i = 0; i < await folder.length; i++) {
                   
                    let f = fileClient.readFile(folder[i].url).then(savedBook => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(savedBook, graph, url, "text/turtle");
                    let blankNode = graph.any(undefined, DBP('title')); 
                    let blankNode2 = graph.any(undefined, SBA('rateDate')); 

                    let book = {
                        "isbn" : graph.any(blankNode, DBO('ISBN'))===null ? "none" : graph.any(blankNode, DBO('ISBN')).value,
                        "title" : graph.any(blankNode, DBP('title'))===null ? "none" : graph.any(blankNode, DBP('title')).value,
                        "author" : graph.any(blankNode, DBP('author'))===null ? "none" : graph.any(blankNode, DBP('author')).value,
                        "publisher" : graph.any(blankNode, DBO('publisher'))===null ? "none" : graph.any(blankNode, DBO('publisher')).value,
                        "language" : graph.any(blankNode, DBP('language'))===null ? "none" : graph.any(blankNode, DBP('language')).value,
                        "abstract" : graph.any(blankNode, DBO('abstract'))===null ? "none" : graph.any(blankNode, DBO('abstract')).value,
                        "numberOfPages" : graph.any(blankNode, DBO('numberOfPages'))===null ? "none" : graph.any(blankNode, DBO('numberOfPages')).value,
                        "releaseDate" : graph.any(blankNode, DBO('releaseDate'))===null ? "none" : graph.any(blankNode, DBO('releaseDate')).value,
                        "literaryGenre" : graph.any(blankNode, DBO('literaryGenre'))===null ? "none" : graph.any(blankNode, DBO('literaryGenre')).value,
                        "link" : graph.any(blankNode, DBR('Link'))===null ? "none" : graph.any(blankNode, DBR('Link')).value,
                        "photo" : graph.any(blankNode, FOAF('photo'))===null ? "none" : graph.any(blankNode, FOAF('photo')).value,
                        "name" : graph.any(blankNode, FOAF('name'))===null ? "none" : graph.any(blankNode, FOAF('name')).value,
                        "source" : graph.any(blankNode, DBO('source'))===null ? "none" : graph.any(blankNode, DBO('source')).value,
                        "saveDate" : graph.any(blankNode2, SBA('saveDate'))===null ? "none" : graph.any(blankNode2, SBA('saveDate')).value
                    }
                    return JSON.stringify(book)
                });
                booksSaved= booksSaved+"%%"+await f
            }
        return (booksSaved)
    }

    export async function removeRatedBook(uri, bookName){
        let url = uri + '/public/SolidGoogleBooks/ratedbooks/' + bookName;
        await removeSolidFile(url)
    }

    export async function removeSavedBook(uri, bookName){
        let url = uri + '/public/SolidGoogleBooks/savedbooks/' + bookName;
        await removeSolidFile(url)
    }

    export async function removeInfoPerso(uri){
        let url = uri + '/public/SolidGoogleBooks/infoperso.ttl';
        await removeSolidFile(url)
    }

    export async function removeFolders(uri){
        //To delete a folder we have to delete it content first
        let url = uri + '/public/SolidGoogleBooks/';
            
        let folder = await fileClient.readFolder( url, {links:"include"} )
        .then(value => {
            return value.files
        });

        for (let i = 0; i < await folder.length; i++) {   
            await removeSolidFile(folder[i].url)
        }
    }