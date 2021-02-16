import * as fileClient from 'solid-file-client';
import * as rdfLib from 'rdflib'
import { createFolder, createSolidFile, appendSolidFile, replaceSolidFile, getUserCard, checkacess, removeSolidFile } from './solidMethods'
import SparqlClient from 'sparql-http-client';



//prefixes
const RDF = rdfLib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
const FOAF = rdfLib.Namespace('http://xmlns.com/foaf/0.1/')
const SMA = rdfLib.Namespace('http://w3id.org/SolidMovies/vocab/')
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
        await createFolder(uri+'public/SolidMovies/');
    }
    export async function createSavedMoviesFolder(uri) {
        await createFolder(uri+'public/SolidMovies/savedmovies/');
    }
    export async function createRatedMoviesFolder(uri) {
        await createFolder(uri+'public/SolidMovies/ratedmovies/');
    }

    export async function createAppDataFile(uri) {
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidMovies/appdata.ttl');
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        graph.add(documentNN, RDF('type'), SMA('SolidMoviesData'));
        graph.add(documentNN, SMA('performedConnexions'), 0);
        graph.add(documentNN, SMA('firstVisit'), new Date());
        var content = rdfLib.serialize(undefined, graph, 'appdata.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidMovies/', 'appdata.ttl', content);
    }

    export async function createInfoPersoFile(uri, fn, ln, email, birthday, gender) {
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidMovies/infoperso.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('PersonalProfileDocument'));
        graph.add(userUri, FOAF('firstName'), fn);
        graph.add(userUri, FOAF('lastName'), ln);
        graph.add(userUri, FOAF('OnlineAccount'), email);
        graph.add(userUri, FOAF('birthday'), birthday);
        graph.add(userUri, FOAF('gender'), gender); 
        var content = rdfLib.serialize(undefined, graph, 'infoperso.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidMovies/', 'infoperso.ttl', content);
    }

    export async function createGenresFile(uri,genres) {

        await removeSolidFile(uri+'public/SolidMovies/genres.ttl')

        let graph = rdfLib.graph()
        let documentNN = rdfLib.sym(uri+'/public/SolidMovies/genres.ttl')
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'))
        genres.map((genre) =>graph.add(userUri, FOAF('interest'), genre) )
        var content = rdfLib.serialize(undefined, graph, 'genres.ttl', 'text/turtle')
        await createSolidFile(uri+'/public/SolidMovies/', 'genres.ttl', content)
    }

    export async function readMoviesGenresFile(uri){
        let genresUrl = uri + '/public/SolidMovies/genres.ttl';

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

        await removeSolidFile(uri+'public/SolidMovies/recommenders.ttl')

        console.log("provider1, provider2, provider3 : " + provider1 + ", " + provider2 + ", " + provider3)
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidMovies/recommenders.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        if(provider1) graph.add(userUri, SMA('chooseProvider'), SMA('LODS_Recommender_System'));
        if(provider2) graph.add(userUri, SMA('chooseProvider'), SMA('SimC_Recommender_System'));
        if(provider3) graph.add(userUri, SMA('chooseProvider'), SMA('SimP_Recommender_System'));
        if(provider1) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'LODS_Recommender_System');
            graph.add(SMA('LODS_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SMA('LODS_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        if(provider2) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'SimC_Recommender_System');
            graph.add(SMA('SimC_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SMA('SimC_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        if(provider3) {
            graph.add(DBR('Recommender_system'), FOAF('name'), 'SimP_Recommender_System');
            graph.add(SMA('SimP_Recommender_System'), RDF('type'), DBO('Website'));
            graph.add(SMA('SimP_Recommender_System'), DCT('subject'), DBC('Recommender_systems'));
        }
        var content = rdfLib.serialize(undefined, graph, 'recommenders.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidMovies/', 'recommenders.ttl', content);
    }

    export async function readRecommendersFile(uri){
        let recommendersUrl = uri + 'public/SolidMovies/recommenders.ttl';
        
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
        let FileUrl = uri + '/public/SolidMovies/recommenders.ttl'
        let r = ''
        if(LODS) r = 'LODS_Recommender_System'
        else if(SimC) r = 'SimC_Recommender_System'
             else if(SimP) r = 'SimP_Recommender_System'
      
        replaceFile(FileUrl, 'recommenders.ttl', uri, SMA('chooseProvider'), r)
        replaceFile(FileUrl, 'recommenders.ttl', DBR('Recommender_system'), FOAF('name'), r)
        replaceFile(FileUrl, 'recommenders.ttl', r , RDF('type'), DBO('Website'))
        replaceFile(FileUrl, 'recommenders.ttl', r , DCT('subject'), DBC('Recommender_systems'))  
    }


    async function checkRatedMovie(uri, title){
        var movies = await readRatedMovies(uri,0).then( (result)=>{ return result })
        let arr = movies.split("%%")
        let jsonArr = []
        for (let index = 1; index < arr.length; index++) {
            jsonArr.push(JSON.parse(arr[index]))
        }

        var t = false
        for (let i = 0; i < jsonArr.length; i++) 
            if(jsonArr[i].title===title) {t=true; break} 

        return t
    }

    async function checkSavedMovie(uri, title){
        var movies = await readSavedMovies(uri).then((result)=>{ return result })
        let arr = movies.split("%%")
        let jsonArr = []
        for (let index = 1; index < arr.length; index++) {
            jsonArr.push(JSON.parse(arr[index]))
        }

        var t = false
        for (let i = 0; i < jsonArr.length; i++) 
            if(jsonArr[i].title===title) {t=true; break} 

        return t
    }

    export async function createSavedMoviesFile(uri, title, subtitle, abstract, runtime, production, language, releaseDate, filmGenre, urlPhoto, provider, link) {
        //console.log(await checkSavedMovie(uri, title))
        if(await checkSavedMovie(uri, title)) {
            await removeSavedMovie(uri, title.split(' ').join('_')+".ttl")
        }
        
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidMovies/savedmovies/'+ title +'.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        graph.add(documentNN, FOAF('primaryTopic'), DBO('Movie'));
        if(title !== undefined) graph.add(documentNN, FOAF('name'), title);
        if(subtitle !== undefined) graph.add(documentNN, DBP('caption'), subtitle);

        if(production !== undefined && typeof production === "object")  
            for (let i = 0; i < production.length; i++) { graph.add(documentNN, DBP('studio'), production[i]) }
        else 
            if(production !== undefined && typeof production === "string") graph.add(documentNN, DBP('studio'), production)    

        if(language !== undefined && typeof language === "object")
            for (let i = 0; i < language.length; i++) { graph.add(documentNN, DBP('language'), language[i]) }
        else 
            if(language !== undefined && typeof language === "string") graph.add(documentNN, DBP('language'), language)  

        if(abstract !== undefined) graph.add(documentNN, DBO('abstract'), abstract);
        if(runtime !== undefined) graph.add(documentNN, DBO('Work/runtime'), runtime);
        if(releaseDate !== undefined) graph.add(documentNN, DBO('releaseDate'), releaseDate);

        if(filmGenre !== undefined && typeof filmGenre === "object") 
            for (let i = 0; i < filmGenre.length; i++) { graph.add(documentNN, DBR('Film_genre'), filmGenre[i]) }
        else 
            if(filmGenre !== undefined && typeof filmGenre === "string") graph.add(documentNN, DBR('Film_genre'), filmGenre)    
        
        if(link !== undefined) graph.add(documentNN, FOAF('homepage'), link);
        if(urlPhoto !== undefined) graph.add(documentNN, FOAF('photo'), urlPhoto);
    
        graph.add(documentNN, DBO('source'), provider);
        graph.add(userUri, SMA('save'), documentNN);
        graph.add(userUri, SMA('saveDate'), new Date());

        var content = rdfLib.serialize(undefined, graph, title+'.ttl', 'text/turtle');

        await createSolidFile(uri+'public/SolidMovies/savedmovies', title+'.ttl', content);
    }

    export async function createRatedMoviesFile(uri, ratingValue, title, subtitle, abstract, runtime, production, language, releaseDate, filmGenre, urlPhoto, provider, link) {
        //console.log(await checkRatedMovie(uri, title))
        if(await checkRatedMovie(uri, title)) {
            await removeRatedMovie(uri, title.split(' ').join('_')+".ttl")
        }
        
        let graph = rdfLib.graph();
        let documentNN = rdfLib.sym(uri+'public/SolidMovies/ratedmovies/'+ title +'.ttl');
        let userUri = rdfLib.sym(uri+'/profile/card#me')
        graph.add(documentNN, RDF('type'), FOAF('Document'));
        graph.add(documentNN, FOAF('primaryTopic'), DBO('Movie'));
        if(title !== undefined) graph.add(documentNN, FOAF('name'), title);
        if(subtitle !== undefined) graph.add(documentNN, DBP('caption'), subtitle);

        if(production !== undefined && typeof production === "object")
            for (let i = 0; i < production.length; i++) { graph.add(documentNN, DBP('studio'), production[i]) }
        else 
            if(production !== undefined && typeof production === "string") graph.add(documentNN, DBP('studio'), production)    

        if(language !== undefined && typeof language === "object")
            for (let i = 0; i < language.length; i++) { graph.add(documentNN, DBP('language'), language[i]) }
        else 
            if(language !== undefined && typeof language === "string") graph.add(documentNN, DBP('language'), language)  

        if(abstract !== undefined) graph.add(documentNN, DBO('abstract'), abstract);
        if(runtime !== undefined) graph.add(documentNN, DBO('Work/runtime'), runtime);
        if(releaseDate !== undefined) graph.add(documentNN, DBO('releaseDate'), releaseDate);

        if(filmGenre !== undefined && typeof filmGenre === "object") 
            for (let i = 0; i < filmGenre.length; i++) { graph.add(documentNN, DBR('Film_genre'), filmGenre[i]) }
        else 
            if(filmGenre !== undefined && typeof filmGenre === "string") graph.add(documentNN, DBR('Film_genre'), filmGenre)    
        
        if(link !== undefined) graph.add(documentNN, FOAF('homepage'), link);
        if(urlPhoto !== undefined) graph.add(documentNN, FOAF('photo'), urlPhoto);

            graph.add(documentNN, DBO('source'), provider);
            graph.add(documentNN, SCHEMA('bestRating'), "5");
            graph.add(documentNN, SCHEMA('ratingValue'), ratingValue);
            graph.add(documentNN, SCHEMA('worstRating'), "1");
            graph.add(userUri, SMA('rateDate'), new Date());
            graph.add(userUri, SMA('rate'), documentNN);

            var content = rdfLib.serialize(undefined, graph, title+'.ttl', 'text/turtle');

            await createSolidFile(uri+'public/SolidMovies/ratedmovies', title+'.ttl', content);
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

    export async function readRatedMovies(uri, minRatingValue){
        let url = uri + '/public/SolidMovies/ratedmovies/';
            let moviesRated=''
            
            let folder = await fileClient.readFolder( url, {links:"include"} )
            .then(value => {
                return value.files
            });

            for (let i = 0; i < await folder.length; i++) {
                   
                let f = fileClient.readFile(folder[i].url).then(ratedMovie => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(ratedMovie, graph, url, "text/turtle");
                    let blankNode = graph.any(undefined, FOAF('name'));
                    let blankNode2 = graph.any(undefined, SMA('rateDate')); 

                    let movie = {
                        "title" : graph.any(blankNode, FOAF('name'))===null ? "none" : graph.any(blankNode, FOAF('name')).value,
                        "subtitle" : graph.any(blankNode, DBP('caption'))===null ? "none" : graph.any(blankNode, DBP('caption')).value,
                        "production" : graph.any(blankNode, DBP('studio'))===null ? "none" : graph.any(blankNode, DBP('studio')).value,
                        "language" : graph.any(blankNode, DBP('language'))===null ? "none" : graph.any(blankNode, DBP('language')).value,
                        "abstract" : graph.any(blankNode, DBO('abstract'))===null ? "none" : graph.any(blankNode, DBO('abstract')).value,
                        "runtime" : graph.any(blankNode, DBO('Work/runtime'))===null ? "none" : graph.any(blankNode, DBO('Work/runtime')).value,
                        "releaseDate" : graph.any(blankNode, DBO('releaseDate'))===null ? "none" : graph.any(blankNode, DBO('releaseDate')).value,
                        "filmGenre" : graph.any(blankNode, DBR('Film_genre'))===null ? "none" : graph.any(blankNode, DBR('Film_genre')).value,
                        "link" : graph.any(blankNode, FOAF('homepage'))===null ? "none" : graph.any(blankNode, FOAF('homepage')).value,
                        "photo" : graph.any(blankNode, FOAF('photo'))===null ? "none" : graph.any(blankNode, FOAF('photo')).value,
                        "source" : graph.any(blankNode, DBO('source'))===null ? "none" : graph.any(blankNode, DBO('source')).value,
                        "ratingValue" : graph.any(blankNode, SCHEMA('ratingValue'))===null ? "none" : graph.any(blankNode, SCHEMA('ratingValue')).value,
                        "rateDate" : graph.any(blankNode2, SMA('rateDate'))===null ? "none" : graph.any(blankNode2, SMA('rateDate')).value
                    }
                    return JSON.stringify(movie)
                });
                moviesRated=moviesRated+"%%"+await f
            }
        return (moviesRated)
    }

    export async function readProfileImage(uri){
        let cardUrl = uri + '/profile/card';

        let cardImage = await fileClient.readFile(cardUrl).then(card => {
            let graph = rdfLib.graph();
            rdfLib.parse(card, graph, cardUrl, "text/turtle");
            let blankNode = graph.any(undefined, FOAF('name')); 
            
            return graph.any(blankNode, VCARD('hasPhoto'))===null ? "none" : graph.any(blankNode, VCARD('hasPhoto')).value
        })

        return cardImage;
    }

    export async function readInfoPerso(uri){
        let infoPersoUrl = uri + '/public/SolidMovies/infoperso.ttl';

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

    export async function readSavedMovies(uri){
        let url = uri + '/public/SolidMovies/savedmovies/';
            let moviesSaved = ''

            let folder = await fileClient.readFolder( url, {links:"include"} )
            .then(value => {
                return value.files
            });

            for (let i = 0; i < await folder.length; i++) {
                   
                    let f = fileClient.readFile(folder[i].url).then(savedMovie => {
                    let graph = rdfLib.graph();
                    rdfLib.parse(savedMovie, graph, url, "text/turtle");
                    let blankNode = graph.any(undefined, FOAF('name'));
                    let blankNode2 = graph.any(undefined, SMA('rateDate')); 

                    let movie = {
                        "title" : graph.any(blankNode, FOAF('name'))===null ? "none" : graph.any(blankNode, FOAF('name')).value,
                        "subtitle" : graph.any(blankNode, DBP('caption'))===null ? "none" : graph.any(blankNode, DBP('caption')).value,
                        "production" : graph.any(blankNode, DBP('studio'))===null ? "none" : graph.any(blankNode, DBP('studio')).value,
                        "language" : graph.any(blankNode, DBP('language'))===null ? "none" : graph.any(blankNode, DBP('language')).value,
                        "abstract" : graph.any(blankNode, DBO('abstract'))===null ? "none" : graph.any(blankNode, DBO('abstract')).value,
                        "runtime" : graph.any(blankNode, DBO('Work/runtime'))===null ? "none" : graph.any(blankNode, DBO('Work/runtime')).value,
                        "releaseDate" : graph.any(blankNode, DBO('releaseDate'))===null ? "none" : graph.any(blankNode, DBO('releaseDate')).value,
                        "filmGenre" : graph.any(blankNode, DBR('Film_genre'))===null ? "none" : graph.any(blankNode, DBR('Film_genre')).value,
                        "link" : graph.any(blankNode, FOAF('homepage'))===null ? "none" : graph.any(blankNode, FOAF('homepage')).value,
                        "photo" : graph.any(blankNode, FOAF('photo'))===null ? "none" : graph.any(blankNode, FOAF('photo')).value,
                        "source" : graph.any(blankNode, DBO('source'))===null ? "none" : graph.any(blankNode, DBO('source')).value,
                        "saveDate" : graph.any(blankNode2, SMA('saveDate'))===null ? "none" : graph.any(blankNode2, SMA('saveDate')).value
                    }
                    return JSON.stringify(movie)
                });
                moviesSaved= moviesSaved+"%%"+await f
            }
        return (moviesSaved)
    }

    export async function removeRatedMovie(uri, movieName){
        let url = uri + '/public/SolidMovies/ratedmovies/' + movieName;
        await removeSolidFile(url)
    }

    export async function removeSavedMovie(uri, movieName){
        let url = uri + '/public/SolidMovies/savedmovies/' + movieName;
        await removeSolidFile(url)
    }

    export async function removeInfoPerso(uri){
        let url = uri + '/public/SolidMovies/infoperso.ttl';
        await removeSolidFile(url)
    }

    export async function removeFolders(uri){
        //To delete a folder we have to delete it content first
        let url = uri + '/public/SolidMovies/';
            
        let folder = await fileClient.readFolder( url, {links:"include"} )
        .then(value => {
            return value.files
        });

        for (let i = 0; i < await folder.length; i++) {   
            await removeSolidFile(folder[i].url)
        }
    }